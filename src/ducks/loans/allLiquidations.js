import { createSlice, createSelector } from '@reduxjs/toolkit';
import keyBy from 'lodash/keyBy';
import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter } from '../../utils/formatters';
import { pageResults } from 'synthetix-data';
import { getEthRate } from 'ducks/rates';

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

const fetchPartialLiquidations = async (loanId) => {
	return pageResults({
		api: loansGraph,
		query: {
			entity: 'loanPartiallyLiquidateds',
			selection: {
				where: {
					loanId: `"${loanId}"`,
				},
			},
			properties: [
				'account',
				'liquidatedAmount',
				'liquidator',
				'liquidatedCollateral',
				'timeStamp',
				'loanId',
			],
		},
	}).then(console.log);
};

export const fetchLiquidations = () => async (dispatch, getState) => {
	const {
		snxJS: { EtherCollateralsUSD },
	} = snxJSConnector;

	const state = getState();
	const ethRate = getEthRate(state);

	dispatch(fetchLiquidationsRequest());

	try {
		let loans = await pageResults({
			api: loansGraph,
			query: {
				entity: 'loans',
				selection: {
					where: {
						isOpen: true,
						collateralMinted: '\\"sUSD\\"',
					},
				},
				properties: ['account', 'amount', 'id', 'isOpen', 'hasPartialLiquidations'],
			},
			max: 1,
			// @ts-ignore
		});
		let liquidatedLoans = loans.map(async (loan) => {
			const loanMetaData = await EtherCollateralsUSD.getLoan(loan.account, Number(loan.id));
			const collateralAmount = bigNumberFormatter(loanMetaData.collateralAmount);
			const currentInterest = bigNumberFormatter(loanMetaData.accruedInterest);
			const loanAmount = bigNumberFormatter(loan.amount);
			const cRatio = (ethRate * collateralAmount) / (loanAmount + currentInterest);
			let partialLiquidations = [];
			if (loan.hasPartialLiquidations) {
				partialLiquidations = fetchPartialLiquidations(Number(loan.id));
			}
			return {
				account: loan.account,
				collateralAmount: collateralAmount,
				loanAmount: loanAmount,
				id: Number(loan.id),
				currentInterest: currentInterest,
				isOpen: loan.isOpen,
				hasPartialLiquidations: loan.hasPartialLiquidations,
				liquidatable: cRatio < 1.5,
				cRatioPercentage: cRatio * 100,
				partialLiquidations: partialLiquidations,
			};
		});

		const promiseLiquidations = await Promise.all(liquidatedLoans);

		const filteredLiquidations = promiseLiquidations.filter((e) => e.liquidatable);

		const objectLiquidations = keyBy(filteredLiquidations, (loan) => {
			return `${loan.id}-${loan.account}`;
		});

		dispatch(fetchLiquidationsSuccess({ liquidations: objectLiquidations }));
	} catch (e) {
		dispatch(fetchLiquidationsFailure({ error: e.message }));
	}
};

export default liquidationsSlice.reducer;
