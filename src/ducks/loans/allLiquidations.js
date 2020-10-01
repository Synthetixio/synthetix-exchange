import { createSlice, createSelector } from '@reduxjs/toolkit';
import keyBy from 'lodash/keyBy';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter, toJSTimestamp } from '../../utils/formatters';
import { pageResults } from 'synthetix-data';
import { getEthRate } from 'ducks/rates';
import { getWalletInfo } from 'ducks/wallet/walletDetails';

const loansGraph = 'https://api.thegraph.com/subgraphs/name/dvd-schwrtz/loans';

export const liquidationsSlice = createSlice({
	name: 'allLiquidations',
	initialState: {
		liquidations: {},
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
	},
	reducers: {
		fetchLiquidationsRequest: (state) => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchLiquidationsFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchLiquidationsSuccess: (state, action) => {
			state.liquidations = action.payload.liquidations;
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
	},
});

export const getLiquidationsState = (state) => state.loans.allLiquidations;
export const getLiquidationsMap = (state) => getLiquidationsState(state).liquidations;
export const getIsLoadingLiquidations = (state) => getLiquidationsState(state).isLoading;
export const getIsRefreshingLiquidations = (state) => getLiquidationsState(state).isRefreshing;
export const getIsLoadedLiquidations = (state) => getLiquidationsState(state).isLoaded;
export const getLiquidationsLoadingError = (state) => getLiquidationsState(state).loadingError;

export const getLiquidations = createSelector(getLiquidationsMap, (liquidationsMap) =>
	Object.values(liquidationsMap)
);

const {
	fetchLiquidationsRequest,
	fetchLiquidationsSuccess,
	fetchLiquidationsFailure,
} = liquidationsSlice.actions;

const fetchPartialLiquidations = async (loanId, walletInfo) => {
	const {
		snxJS: { contractSettings, EtherCollateralsUSD },
	} = snxJSConnector;

	let contract = EtherCollateralsUSD.contract;

	const filter = {
		fromBlock: 'earliest',
		toBlock: 'latest',
		...contract.filters.LoanPartiallyLiquidated(walletInfo.currentWallet),
	};

	const events = await contractSettings.provider.getLogs(filter);

	const loanIDs = events.map((log) => {
		return {
			log: contract.interface.parseLog(log),
			txHash: log.transactionHash,
		};
	});

	const loans = loanIDs.map(async (element) => {
		const values = element.log.values;
		const liquidatedCollateral = bigNumberFormatter(values.liquidatedCollateral);
		const penaltyAmount = liquidatedCollateral * 0.1;
		return {
			txHash: element.txHash,
			liquidator: values.liquidator,
			liquidatedAmount: bigNumberFormatter(values.liquidatedAmount),
			liquidatedCollateral: liquidatedCollateral,
			penaltyAmount: penaltyAmount,
			loanId: Number(values.loanID),
		};
	});

	const promisedPartialResolved = await Promise.all(loans);

	const filteredPartials = promisedPartialResolved.filter((e) => {
		return e.loanId === loanId;
	});

	return filteredPartials;
	// return pageResults({
	// 	api: loansGraph,
	// 	query: {
	// 		entity: 'loanPartiallyLiquidateds',
	// 		selection: {
	// 			where: {
	// 				loanId: `\\"${loanId}\\"`,
	// 			},
	// 		},
	// 		properties: [
	// 			'account',
	// 			'liquidatedAmount',
	// 			'liquidator',
	// 			'liquidatedCollateral',
	// 			'timeStamp',
	// 			'loanId',
	// 		],
	// 	},
	// }).then(console.log);
};

export const fetchLiquidations = () => async (dispatch, getState) => {
	const {
		snxJS: { contractSettings, EtherCollateralsUSD },
	} = snxJSConnector;

	const state = getState();
	const ethRate = getEthRate(state);
	const walletInfo = getWalletInfo(state);

	let contract = EtherCollateralsUSD.contract;

	dispatch(fetchLiquidationsRequest());

	// try {
	// let loans = await pageResults({
	// 	api: loansGraph,
	// 	query: {
	// 		entity: 'loans',
	// 		selection: {
	// 			where: {
	// 				isOpen: true,
	// 				collateralMinted: '\\"sUSD\\"',
	// 			},
	// 		},
	// 		properties: ['account', 'amount', 'id', 'isOpen', 'hasPartialLiquidations'],
	// 	},
	// 	max: 1,
	// 	// @ts-ignore
	// });

	const filter = {
		fromBlock: 'earliest',
		toBlock: 'latest',
		...contract.filters.LoanCreated(walletInfo.currentWallet),
	};
	const events = await contractSettings.provider.getLogs(filter);

	const C_RATIO = bigNumberFormatter(await contract.collateralizationRatio()) / 100;
	const PENALTY = bigNumberFormatter(await contract.liquidationPenalty());

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

	const liquidatedLoans = loanIDs.map(async (element) => {
		const loan = await contract.getLoan(walletInfo.currentWallet, element.id);
		const currentInterest = bigNumberFormatter(loan.accruedInterest);
		const loanAmount = bigNumberFormatter(loan.loanAmount);
		const collateralAmount = bigNumberFormatter(loan.collateralAmount);
		const cRatio = (ethRate * collateralAmount) / (loanAmount + currentInterest);

		const debtBalance = loanAmount + currentInterest;
		const collateralUSDValue = ethRate * collateralAmount;

		let totalDebtToCover = 0;

		if (cRatio < C_RATIO) {
			const dividend = debtBalance - collateralUSDValue / C_RATIO;
			const divisor = 1 - (1 + PENALTY) / C_RATIO;
			totalDebtToCover = dividend / divisor;
		}

		let partialLiquidations = await fetchPartialLiquidations(element.id, walletInfo);
		// let partialLiquidations = [];
		// if (loan.hasPartialLiquidations) {
		// 	partialLiquidations = await fetchPartialLiquidations(Number(loan.id));
		// }

		return {
			account: loan.account,
			collateralAmount: collateralAmount,
			loanAmount: loanAmount,
			loanId: element.id,
			currentInterest: currentInterest,
			totalDebtToCover: totalDebtToCover,
			penaltyPercentage: PENALTY,
			// isOpen: loan.isOpen,
			// hasPartialLiquidations: loan.hasPartialLiquidations,
			liquidatable: cRatio < C_RATIO,
			cRatioPercentage: cRatio * 100,
			partialLiquidations: partialLiquidations,
		};

		// return {
		// 	collateralAmount: bigNumberFormatter(loan.collateralAmount),
		// 	loanAmount: bigNumberFormatter(loan.loanAmount),
		// 	timeCreated: toJSTimestamp(loan.timeCreated),
		// 	loanID: element.id,
		// 	timeClosed,
		// 	feesPayable: bigNumberFormatter(loan.totalFees),
		// 	currentInterest: bigNumberFormatter(loan.interest ?? loan.accruedInterest),
		// 	status: timeClosed > 0 ? LOAN_STATUS.CLOSED : LOAN_STATUS.OPEN,
		// 	transactionHash: null,
		// 	loanType: tx.to === EtherCollateral.contract.address ? 'sETH' : 'sUSD',
		// };
	});

	// const promiseLoansResolved = await Promise.all(loans);

	// let liquidatedLoans = loans.map(async (loan) => {
	// 	const loanMetaData = await EtherCollateralsUSD.getLoan(loan.account, Number(loan.id));
	// 	const collateralAmount = bigNumberFormatter(loanMetaData.collateralAmount);
	// 	const currentInterest = bigNumberFormatter(loanMetaData.accruedInterest);
	// 	const loanAmount = bigNumberFormatter(loan.amount);
	// 	const cRatio = (ethRate * collateralAmount) / (loanAmount + currentInterest);
	// 	let partialLiquidations = [];
	// 	if (loan.hasPartialLiquidations) {
	// 		partialLiquidations = await fetchPartialLiquidations(Number(loan.id));
	// 	}
	// 	return {
	// 		account: loan.account,
	// 		collateralAmount: collateralAmount,
	// 		loanAmount: loanAmount,
	// 		id: Number(loan.id),
	// 		currentInterest: currentInterest,
	// 		isOpen: loan.isOpen,
	// 		hasPartialLiquidations: loan.hasPartialLiquidations,
	// 		liquidatable: cRatio < 1.5,
	// 		cRatioPercentage: cRatio * 100,
	// 		partialLiquidations: partialLiquidations,
	// 	};
	// });

	const promiseLiquidations = await Promise.all(liquidatedLoans);

	console.log(promiseLiquidations);

	const filteredLiquidations = promiseLiquidations.filter((e) => e.liquidatable);

	const objectLiquidations = keyBy(filteredLiquidations, (loan) => {
		return `${loan.loanId}-${loan.account}`;
	});

	dispatch(fetchLiquidationsSuccess({ liquidations: objectLiquidations }));
	// } catch (e) {
	// 	dispatch(fetchLiquidationsFailure({ error: e.message }));
	// }
};

export default liquidationsSlice.reducer;
