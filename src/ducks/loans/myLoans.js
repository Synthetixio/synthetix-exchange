import { createSlice, createSelector } from '@reduxjs/toolkit';
import keyBy from 'lodash/keyBy';
import snxJSConnector from '../../utils/snxJSConnector';
import { getWalletInfo } from '../wallet/walletDetails';
import { bigNumberFormatter, toJSTimestamp } from '../../utils/formatters';
import { getEthRate } from 'ducks/rates';

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

export const fetchLoans = () => async (dispatch, getState) => {
	const {
		snxJS: { EtherCollateral, contractSettings, EtherCollateralsUSD },
		provider,
	} = snxJSConnector;

	const state = getState();
	const ethRate = getEthRate(state);
	const walletInfo = getWalletInfo(state);

	const { contractType } = state.loans.contractInfo;

	let contract = contractType === 'sETH' ? EtherCollateral.contract : EtherCollateralsUSD.contract;

	dispatch(fetchLoansRequest());

	try {
		const filter = {
			fromBlock: 'earliest',
			toBlock: 'latest',
			...contract.filters.LoanCreated(walletInfo.currentWallet),
		};
		const events = await contractSettings.provider.getLogs(filter);

		const loanIDs = events
			.map((log) => {
				return {
					log: contract.interface.parseLog(log),
					txHash: log.transactionHash,
				};
			})
			.map((event) => {
				return {
					txHash: event.txHash,
					id: Number(event.log.values.loanID),
				};
			});

		const loans = loanIDs.map(async (element) => {
			const tx = await provider.getTransactionReceipt(element.txHash);
			const loan = await contract.getLoan(walletInfo.currentWallet, element.id);
			const currentInterest = bigNumberFormatter(loan.interest ?? loan.accruedInterest);
			const timeClosed = toJSTimestamp(loan.timeClosed);
			const loanAmount = bigNumberFormatter(loan.loanAmount);
			const collateralAmount = bigNumberFormatter(loan.collateralAmount);
			const cRatio = (ethRate * collateralAmount) / (loanAmount + currentInterest);
			return {
				collateralAmount: collateralAmount,
				loanAmount: loanAmount,
				timeCreated: toJSTimestamp(loan.timeCreated),
				loanID: element.id,
				timeClosed,
				feesPayable: bigNumberFormatter(loan.totalFees),
				currentInterest: currentInterest,
				status: timeClosed > 0 ? LOAN_STATUS.CLOSED : LOAN_STATUS.OPEN,
				cRatio: cRatio * 100,
				transactionHash: null,
				loanType: tx.to === EtherCollateral.contract.address ? 'sETH' : 'sUSD',
			};
		});

		const promiseLoansResolved = await Promise.all(loans);

		const filteredLoans = promiseLoansResolved.filter((e) => {
			if (contractType === 'sETH') {
				return e.loanType === 'sETH';
			} else {
				return e.loanType === 'sUSD';
			}
		});

		const objectLoans = keyBy(filteredLoans, (loan) => {
			return `${loan.loanID}-${loan.loanType}`;
		});

		dispatch(fetchLoansSuccess({ loans: objectLoans }));
	} catch (e) {
		dispatch(fetchLoansFailure({ error: e.message }));
	}
};

export default myLoansSlice.reducer;

export { updateLoan, createLoan };
