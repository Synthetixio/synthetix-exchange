import update from 'immutability-helper';

const CREATE_LOAN = 'LOAN/CREATE_LOAN';
const UPDATE_LOAN = 'LOAN/UPDATE_LOAN';
const REMOVE_PENDING_LOANS = 'LOAN/REMOVE_PENDING_LOANS';
const SET_LOANS = 'LOAN/SET_LOANS';

const defaultState = {
	loans: [],
	pendingLoans: [],
};

const reducer = (state = defaultState, action = {}) => {
	switch (action.type) {
		case SET_LOANS: {
			return {
				...state,
				loans: action.payload.loans,
			};
		}
		case CREATE_LOAN: {
			return {
				...state,
				pendingLoans: [...state.pendingLoans, action.payload.loan],
			};
		}
		case REMOVE_PENDING_LOANS: {
			return {
				...state,
				pendingLoans: state.pendingLoans.filter(({ loanId }) => loanId !== action.payload.loanId),
			};
		}
		case UPDATE_LOAN: {
			const { loanId, loanInfo } = action.payload;
			const loanIdIndex = state.loans.findIndex(loan => loan.loanId === loanId);

			return {
				...state,
				loans: update(state.loans, {
					[loanIdIndex]: {
						$merge: loanInfo,
					},
				}),
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

export const createLoan = () => () => {
	console.log('TODO');
};

export const closeLoan = () => () => {
	console.log('TODO');
};

export const updateLoan = payload => ({
	type: UPDATE_LOAN,
	payload,
});

export default reducer;
