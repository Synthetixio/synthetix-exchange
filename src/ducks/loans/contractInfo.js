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
		contractType: 'sUSD',
		contract: null,
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
		setContractType: (state, action) => {
			state.contractType = action.payload.contractType;
		},
		setContract: (state, action) => {
			state.contract = action.payload.contract;
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
export const getContractType = (state) => getLoansContractInfoState(state).contractType;
export const getContract = (state) => getLoansContractInfoState(state).contract;

const {
	fetchLoansContractInfoRequest,
	fetchLoansContractInfoSuccess,
	fetchLoansContractInfoFailure,
	setContractType,
	setContract,
} = contractInfoSlice.actions;

export const fetchLoansContractInfo = () => async (dispatch, getState) => {
	const {
		snxJS: { EtherCollateral },
		etherCollateralsUSDContract,
	} = snxJSConnector;
	let contract;

	const state = getState();
	const { contractType } = state.loans.contractInfo;

	if (contractType === 'sETH') {
		contract = EtherCollateral.contract;
	} else {
		contract = etherCollateralsUSDContract;
	}

	dispatch(setContract({ contract }));
	dispatch(fetchLoansContractInfoRequest());

	try {
		const [contractInfo, lockedETHBalance] = await Promise.all([
			contract.getContractInfo(),
			snxJSConnector.provider.getBalance(contract.address),
		]);

		const collateralPair = {
			collateralCurrencyKey: CRYPTO_CURRENCY_MAP.ETH,
			loanCurrencyKey: contractType === 'sETH' ? SYNTHS_MAP.sETH : SYNTHS_MAP.sUSD,
			minLoanSize:
				contractType === 'sETH'
					? bigNumberFormatter(contractInfo._minLoanSize)
					: bigNumberFormatter(contractInfo._minLoanCollateralSize),
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

export const setSelectedContractType = (contractType) => (dispatch) => {
	dispatch(setContractType({ contractType }));
};

export default contractInfoSlice.reducer;
