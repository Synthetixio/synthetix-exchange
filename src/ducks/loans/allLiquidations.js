import { createSlice, createSelector } from '@reduxjs/toolkit';
import keyBy from 'lodash/keyBy';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter } from '../../utils/formatters';
import snxData from 'synthetix-data';
import { getEthRate } from 'ducks/rates';

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

export const fetchLiquidations = () => async (dispatch, getState) => {
	const {
		snxJS: { EtherCollateralsUSD },
	} = snxJSConnector;

	const state = getState();
	const ethRate = getEthRate(state);

	let contract = EtherCollateralsUSD.contract;
	const C_RATIO = bigNumberFormatter(await contract.collateralizationRatio()) / 100;
	const PENALTY = bigNumberFormatter(await contract.liquidationPenalty());

	dispatch(fetchLiquidationsRequest());

	try {
		let loans = await snxData.etherCollateral.loans({ isOpen: true, collateralMinted: 'sUSD' });

		const liquidatedLoans = loans.map(async (loan) => {
			const loanMetaData = await contract.getLoan(loan.account, loan.id);
			const currentInterest = bigNumberFormatter(loanMetaData.accruedInterest);
			const collateralAmount = bigNumberFormatter(loanMetaData.collateralAmount);
			const cRatio = (ethRate * collateralAmount) / (loan.amount + currentInterest);
			const debtBalance = loan.amount + currentInterest;
			const collateralUSDValue = ethRate * collateralAmount;
			let totalDebtToCover = 0;

			if (cRatio < C_RATIO) {
				const dividend = debtBalance - collateralUSDValue / C_RATIO;
				const divisor = 1 - (1 + PENALTY) / C_RATIO;
				totalDebtToCover = dividend / divisor;
			}

			let partialLiquidations = [];
			if (loan.hasPartialLiquidations) {
				partialLiquidations = await snxData.etherCollateral.partiallyLiquidatedLoans({
					loanId: loan.id,
				});
			}

			return {
				account: loan.account,
				collateralAmount: collateralAmount,
				loanAmount: loan.amount,
				loanId: loan.id,
				currentInterest: currentInterest,
				totalDebtToCover: totalDebtToCover,
				penaltyPercentage: PENALTY,
				liquidatable: cRatio < C_RATIO,
				cRatioPercentage: cRatio * 100,
				partialLiquidations: partialLiquidations,
			};
		});

		const promiseLiquidations = await Promise.all(liquidatedLoans);

		const filteredLiquidations = promiseLiquidations.filter(
			(e) => e.liquidatable && e.totalDebtToCover > 1
		);

		const objectLiquidations = keyBy(filteredLiquidations, (loan) => {
			return `${loan.loanId}-${loan.account}`;
		});

		dispatch(fetchLiquidationsSuccess({ liquidations: objectLiquidations }));
	} catch (e) {
		dispatch(fetchLiquidationsFailure({ error: e.message }));
	}
};

export default liquidationsSlice.reducer;
