import { createSlice, createSelector } from '@reduxjs/toolkit';
import keyBy from 'lodash/keyBy';
import snxJSConnector from '../../utils/snxJSConnector';
import { getWalletInfo } from '../wallet/walletDetails';
import { bigNumberFormatter, toJSTimestamp } from '../../utils/formatters';
import { getEthRate } from 'ducks/rates';
import { pageResults } from 'synthetix-data';

const loansGraph = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix-loans';

export const LOAN_STATUS = {
	OPEN: 'open',
	WAITING: 'waiting',
	CLOSED: 'closed',
	CLOSING: 'closing',
};

export const myLoansSlice = createSlice({
	name: 'myLoans',
	initialState: {
		loans: {},
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
	},
	reducers: {
		fetchLoansRequest: (state) => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchLoansFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchLoansSuccess: (state, action) => {
			state.loans = action.payload.loans;
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
		createLoan: (state, action) => {
			const { loan } = action.payload;
			// There is no loanID when creating a loan, so we are using the tx hash as key
			state.loans[loan.transactionHash] = loan;
		},
		updateLoan: (state, action) => {
			const { loanID, loanInfo, loanType } = action.payload;
			const loan = state.loans[`${loanID}-${loanType}`];

			if (loan != null) {
				state.loans[`${loanID}-${loanType}`] = { ...loan, ...loanInfo };
			}
		},
	},
});

export const getMyLoansState = (state) => state.loans.myLoans;
export const getMyLoansMap = (state) => getMyLoansState(state).loans;
export const getIsLoadingMyLoans = (state) => getMyLoansState(state).isLoading;
export const getIsRefreshingMyLoans = (state) => getMyLoansState(state).isRefreshing;
export const getIsLoadedMyLoans = (state) => getMyLoansState(state).isLoaded;
export const getMyLoansLoadingError = (state) => getMyLoansState(state).loadingError;

export const getMyLoans = createSelector(getMyLoansMap, (loansMap) => Object.values(loansMap));

const {
	updateLoan,
	createLoan,
	fetchLoansRequest,
	fetchLoansSuccess,
	fetchLoansFailure,
} = myLoansSlice.actions;

const fetchPartialLiquidations = async (loanId) => {
	const partialLiquidations = await pageResults({
		api: loansGraph,
		query: {
			entity: 'loanPartiallyLiquidateds',
			selection: {
				where: {
					loanId: `\\"${loanId}\\"`,
				},
			},
			properties: [
				'account',
				'liquidatedAmount',
				'liquidator',
				'liquidatedCollateral',
				'loanId',
				'id',
			],
		},
	});

	const mappedPartialLiquidations = partialLiquidations.map((partial) => {
		const liquidatedCollateral = bigNumberFormatter(partial.liquidatedCollateral);
		const penaltyAmount = liquidatedCollateral * 0.1;
		const parsedTx = partial.id.split('-')[0];
		return {
			txHash: parsedTx,
			liquidator: partial.liquidator,
			liquidatedAmount: bigNumberFormatter(partial.liquidatedAmount),
			liquidatedCollateral: liquidatedCollateral,
			penaltyAmount: penaltyAmount,
			loanId: Number(partial.loanID),
		};
	});

	return mappedPartialLiquidations;
};

export const fetchLoans = () => async (dispatch, getState) => {
	const {
		snxJS: { EtherCollateral, EtherCollateralsUSD },
	} = snxJSConnector;

	const state = getState();
	const ethRate = getEthRate(state);
	const walletInfo = getWalletInfo(state);

	const { contractType } = state.loans.contractInfo;

	let contract = contractType === 'sETH' ? EtherCollateral.contract : EtherCollateralsUSD.contract;

	dispatch(fetchLoansRequest());

	try {
		let loansResponse = await pageResults({
			api: loansGraph,
			query: {
				entity: 'loans',
				selection: {
					where: {
						account: `\\"${walletInfo.currentWallet}\\"`,
						collateralMinted: `\\"${contractType}\\"`,
					},
				},
				properties: [
					'account',
					'amount',
					'id',
					'isOpen',
					'hasPartialLiquidations',
					'createdAt',
					'closedAt',
					'txHash',
				],
			},
		});

		const loans = loansResponse.map(async (loan) => {
			const id = Number(loan.id);
			const loanMetaData = await contract.getLoan(loan.account, id);
			const currentInterest = bigNumberFormatter(
				loanMetaData.interest ?? loanMetaData.accruedInterest
			);
			const loanAmount = bigNumberFormatter(loan.amount);
			const collateralAmount = bigNumberFormatter(loanMetaData.collateralAmount);
			const cRatio = ((ethRate * collateralAmount) / (loanAmount + currentInterest)) * 100;
			const timeCreated = toJSTimestamp(loan.createdAt);
			const timeClosed = toJSTimestamp(loan.closedAt);
			const totalFees = bigNumberFormatter(loanMetaData.totalFees);

			let partialLiquidations = [];
			if (loan.hasPartialLiquidations) {
				partialLiquidations = await fetchPartialLiquidations(id);
			}

			return {
				collateralAmount: collateralAmount,
				loanAmount: loanAmount,
				timeCreated: timeCreated,
				timeClosed,
				loanID: id,
				feesPayable: totalFees,
				currentInterest: currentInterest,
				status: timeClosed > timeCreated ? LOAN_STATUS.CLOSED : LOAN_STATUS.OPEN,
				cRatio: cRatio,
				loanType: contractType,
				txHash: loan.txHash,
				partialLiquidations: partialLiquidations,
			};
		});

		const promiseLoansResolved = await Promise.all(loans);

		const objectLoans = keyBy(promiseLoansResolved, (loan) => {
			return `${loan.loanID}-${loan.loanType}`;
		});

		dispatch(fetchLoansSuccess({ loans: objectLoans }));
	} catch (e) {
		dispatch(fetchLoansFailure({ error: e.message }));
	}
};

export default myLoansSlice.reducer;

export { updateLoan, createLoan };
