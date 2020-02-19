import update from 'immutability-helper';

import snxJSConnector from '../utils/snxJSConnector';
import { getWalletInfo } from './index';
import { bigNumberFormatter, toJSTimestamp } from '../utils/formatters';

const FETCH_LOANS_REQUEST = 'LOAN/FETCH_LOANS_REQUEST';
const FETCH_LOANS_SUCCESS = 'LOAN/FETCH_LOANS_SUCCESS';
const FETCH_LOANS_FAILURE = 'LOAN/FETCH_LOANS_FAILURE';

const CREATE_LOAN = 'LOAN/CREATE_LOAN';
const CLOSE_LOAN = 'LOAN/CLOSE_LOAN';
const UPDATE_LOAN = 'LOAN/UPDATE_LOAN';
const SET_LOANS = 'LOAN/SET_LOANS';
const REMOVE_LOAN = 'LOAN/REMOVE_LOAN';

export const LOAN_STATUS = {
	OPEN: 'open',
	WAITING: 'waiting',
	CLOSED: 'closed',
	CLOSING: 'closing',
};

const defaultState = {
	loans: [],
	isFetchingLoans: false,
};

const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case FETCH_LOANS_REQUEST: {
			return {
				...state,
				isFetchingLoans: true,
			};
		}
		case FETCH_LOANS_SUCCESS: {
			return {
				...state,
				isFetchingLoans: false,
			};
		}
		case FETCH_LOANS_FAILURE: {
			return {
				...state,
				isFetchingLoans: false,
			};
		}
		case SET_LOANS: {
			return {
				...state,
				loans: action.payload.loans,
			};
		}
		case CREATE_LOAN: {
			return {
				...state,
				loans: [action.payload.loan, ...state.loans],
			};
		}
		case CLOSE_LOAN: {
			const { loanID, transactionHash } = action.payload;

			const loanIDIndex = state.loans.findIndex(
				loan => loan.loanID === loanID || loan.transactionHash === transactionHash
			);

			return {
				...state,
				loans: update(state.loans, {
					[loanIDIndex]: {
						status: {
							$set: LOAN_STATUS.CLOSING,
						},
					},
				}),
			};
		}
		case UPDATE_LOAN: {
			const { loanID, transactionHash, loanInfo } = action.payload;
			const loanIDIndex = state.loans.findIndex(
				loan => loan.loanID === loanID || loan.transactionHash === transactionHash
			);

			return {
				...state,
				loans: update(state.loans, {
					[loanIDIndex]: {
						$merge: loanInfo,
					},
				}),
			};
		}
		case REMOVE_LOAN: {
			const { loanID } = action.payload;

			return {
				...state,
				loans: state.loans.filter(loan => loan.loanID !== loanID),
			};
		}

		default:
			return state;
	}
};

export const setLoans = payload => ({
	type: SET_LOANS,
	payload,
});

export const updateLoan = payload => ({
	type: UPDATE_LOAN,
	payload,
});

export const removeLoan = payload => ({
	type: REMOVE_LOAN,
	payload,
});

export const createLoan = payload => ({
	type: CREATE_LOAN,
	payload,
});

export const closeLoan = payload => ({
	type: CLOSE_LOAN,
	payload,
});

export const fetchLoansRequest = () => ({
	type: FETCH_LOANS_REQUEST,
});

export const fetchLoansFailure = () => ({
	type: FETCH_LOANS_FAILURE,
});

export const fetchLoansSuccess = () => ({
	type: FETCH_LOANS_SUCCESS,
});

export const fetchLoans = () => async (dispatch, getState) => {
	const {
		snxJS: { EtherCollateral },
	} = snxJSConnector;

	const state = getState();
	const walletInfo = getWalletInfo(state);
	// const loansFromState = getLoans(state);

	dispatch(fetchLoansRequest());

	try {
		const loanIDs = await EtherCollateral.openLoanIDsByAccount(walletInfo.currentWallet);
		const loans = [];

		for (const loanID of loanIDs.map(Number)) {
			const loan = await EtherCollateral.getLoan(walletInfo.currentWallet, loanID);
			const timeClosed = toJSTimestamp(loan.timeClosed);

			loans.push({
				collateralAmount: bigNumberFormatter(loan.collateralAmount),
				loanAmount: bigNumberFormatter(loan.loanAmount),
				timeCreated: toJSTimestamp(loan.timeCreated),
				loanID,
				timeClosed,
				feesPayable: bigNumberFormatter(loan.totalFees),
				currentInterest: bigNumberFormatter(loan.interest),
				status: timeClosed > 0 ? LOAN_STATUS.CLOSED : LOAN_STATUS.OPEN,
				transactionHash: null,
			});
		}
		dispatch(setLoans({ loans }));
		dispatch(fetchLoansSuccess());
		return true;
	} catch (e) {
		dispatch(fetchLoansFailure());
		return false;
	}
};

export default reducer;
