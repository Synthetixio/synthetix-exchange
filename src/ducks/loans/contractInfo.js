import { createSlice } from '@reduxjs/toolkit';

import snxJSConnector from '../../utils/snxJSConnector';
import { bigNumberFormatter } from '../../utils/formatters';

import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from '../../constants/currency';

export const contractInfoSlice = createSlice({
	name: 'contractInfo',
	initialState: {
		collateralPair: null,
		loadingError: null,
		isLoading: false,
		isLoaded: false,
		isRefreshing: false,
	},
	reducers: {
		fetchLoansContractInfoRequest: (state) => {
			state.loadingError = null;
			state.isLoading = true;
			if (state.isLoaded) {
				state.isRefreshing = true;
			}
		},
		fetchLoansContractInfoFailure: (state, action) => {
			state.loadingError = action.payload.error;
			state.isLoading = false;
			state.isRefreshing = false;
		},
		fetchLoansContractInfoSuccess: (state, action) => {
			state.collateralPair = action.payload.collateralPair;
			state.isLoading = false;
			state.isRefreshing = false;
			state.isLoaded = true;
		},
	},
});

export const getLoansContractInfoState = (state) => state.loans.contractInfo;
export const getIsLoadingLoansContractInfo = (state) => getLoansContractInfoState(state).isLoading;
export const getIsRefreshingLoansContractInfo = (state) =>
	getLoansContractInfoState(state).isRefreshing;
export const getIsLoadedLoansContractInfo = (state) => getLoansContractInfoState(state).isLoaded;
export const getLoansContractInfoLoadingError = (state) =>
	getLoansContractInfoState(state).loadingError;
export const getLoansCollateralPair = (state) => getLoansContractInfoState(state).collateralPair;

const {
	fetchLoansContractInfoRequest,
	fetchLoansContractInfoSuccess,
	fetchLoansContractInfoFailure,
} = contractInfoSlice.actions;

export const fetchLoansContractInfo = () => async (dispatch) => {
	const {
		snxJS: { EtherCollateral },
	} = snxJSConnector;

	dispatch(fetchLoansContractInfoRequest());

	try {
		const [contractInfo, lockedETHBalance] = await Promise.all([
			EtherCollateral.getContractInfo(),
			snxJSConnector.provider.getBalance(EtherCollateral.contract.address),
		]);

		const collateralPair = {
			collateralCurrencyKey: CRYPTO_CURRENCY_MAP.ETH,
			loanCurrencyKey: SYNTHS_MAP.sETH,
			minLoanSize: bigNumberFormatter(contractInfo._minLoanSize),
			issuanceRatio: 100 / bigNumberFormatter(contractInfo._collateralizationRatio),
			issueFeeRatePercent: bigNumberFormatter(contractInfo._issueFeeRate),
			collateralizationRatioPercent: bigNumberFormatter(contractInfo._collateralizationRatio) / 100,
			interestRatePercent: bigNumberFormatter(contractInfo._interestRate),
			totalOpenLoanCount: Number(contractInfo._totalOpenLoanCount),
			issueLimit: bigNumberFormatter(contractInfo._issueLimit),
			totalIssuedSynths: bigNumberFormatter(contractInfo._totalIssuedSynths),
			lockedCollateralAmount: bigNumberFormatter(lockedETHBalance),
		};

		dispatch(fetchLoansContractInfoSuccess({ collateralPair }));
	} catch (e) {
		dispatch(fetchLoansContractInfoFailure({ error: e.message }));
	}
};

export default contractInfoSlice.reducer;
