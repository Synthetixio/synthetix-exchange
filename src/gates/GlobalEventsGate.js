import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateLoan, swapTxHashWithLoanID, LOAN_STATUS } from '../ducks/loans/myLoans';
import { fetchWalletBalances } from '../ducks/wallet';
import { fetchRates } from '../ducks/rates';
import { fetchLoansContractInfo } from '../ducks/loans/contractInfo';

import snxJSConnector from '../utils/snxJSConnector';

import { LOAN_EVENTS, EXCHANGE_RATES_EVENTS } from '../constants/events';

const GlobalEventsGate = ({
	updateLoan,
	fetchWalletBalances,
	fetchLoansContractInfo,
	swapTxHashWithLoanID,
	fetchRates,
}) => {
	useEffect(() => {
		const {
			snxJS: { EtherCollateral, ExchangeRates },
		} = snxJSConnector;

		EtherCollateral.contract.on(LOAN_EVENTS.LOAN_CREATED, (_account, loanID, _amount, tx) => {
			fetchLoansContractInfo();
			fetchWalletBalances();

			const { transactionHash } = tx;
			const loanIDNumber = Number(loanID);

			updateLoan({
				transactionHash,
				loanInfo: {
					loanID: loanIDNumber,
					status: LOAN_STATUS.OPEN,
				},
				swapTransactionHashWithLoanID: true,
			});

			swapTxHashWithLoanID({
				transactionHash,
				loanID: loanIDNumber,
			});
		});

		EtherCollateral.contract.on(LOAN_EVENTS.LOAN_CLOSED, (_, loanID) => {
			fetchLoansContractInfo();
			fetchWalletBalances();
			updateLoan({
				loanID: Number(loanID),
				loanInfo: {
					status: LOAN_STATUS.CLOSED,
				},
			});
		});

		ExchangeRates.contract.on(EXCHANGE_RATES_EVENTS.RATES_UPDATED, fetchRates);

		return () => {
			Object.values(LOAN_EVENTS).forEach(event =>
				EtherCollateral.contract.removeAllListeners(event)
			);
			Object.values(EXCHANGE_RATES_EVENTS).forEach(event =>
				ExchangeRates.contract.removeAllListeners(event)
			);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return null;
};

GlobalEventsGate.propTypes = {
	updateLoan: PropTypes.func,
	fetchWalletBalances: PropTypes.func,
	fetchLoansContractInfo: PropTypes.func,
	fetchRates: PropTypes.func,
};

const mapDispatchToProps = {
	swapTxHashWithLoanID,
	updateLoan,
	fetchWalletBalances,
	fetchLoansContractInfo,
	fetchRates,
};

export default connect(null, mapDispatchToProps)(GlobalEventsGate);
