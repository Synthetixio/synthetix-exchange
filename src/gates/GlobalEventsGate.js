import { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { updateLoan, swapTxHashWithLoanID, LOAN_STATUS } from '../ducks/loans/myLoans';
import { fetchWalletBalancesRequest } from '../ducks/wallet/walletBalances';
import { getWalletInfo } from '../ducks/wallet/walletDetails';
import { fetchRatesRequest } from '../ducks/rates';
import { fetchLoansContractInfo } from '../ducks/loans/contractInfo';

import snxJSConnector from '../utils/snxJSConnector';

import { LOAN_EVENTS, EXCHANGE_RATES_EVENTS, EXCHANGE_EVENTS } from '../constants/events';

const GlobalEventsGate = ({
	updateLoan,
	fetchWalletBalancesRequest,
	fetchLoansContractInfo,
	swapTxHashWithLoanID,
	fetchRatesRequest,
	walletInfo: { currentWallet },
}) => {
	useEffect(() => {
		const {
			snxJS: { EtherCollateral, ExchangeRates },
		} = snxJSConnector;

		EtherCollateral.contract.on(LOAN_EVENTS.LOAN_CREATED, (_account, loanID, _amount, tx) => {
			fetchLoansContractInfo();
			fetchWalletBalancesRequest();

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
			fetchWalletBalancesRequest();
			updateLoan({
				loanID: Number(loanID),
				loanInfo: {
					status: LOAN_STATUS.CLOSED,
				},
			});
		});

		ExchangeRates.contract.on(EXCHANGE_RATES_EVENTS.RATES_UPDATED, fetchRatesRequest);

		return () => {
			Object.values(LOAN_EVENTS).forEach((event) =>
				EtherCollateral.contract.removeAllListeners(event)
			);
			Object.values(EXCHANGE_RATES_EVENTS).forEach((event) =>
				ExchangeRates.contract.removeAllListeners(event)
			);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!currentWallet) return;
		const {
			snxJS: { Synthetix },
		} = snxJSConnector;

		Synthetix.contract.on(EXCHANGE_EVENTS.SYNTH_EXCHANGE, (address) => {
			if (address === currentWallet) {
				fetchWalletBalancesRequest();
			}
		});

		return () => {
			Object.values(EXCHANGE_EVENTS).forEach((event) =>
				Synthetix.contract.removeAllListeners(event)
			);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return null;
};

GlobalEventsGate.propTypes = {
	updateLoan: PropTypes.func,
	fetchWalletBalancesRequest: PropTypes.func,
	fetchLoansContractInfo: PropTypes.func,
	fetchRatesRequest: PropTypes.func,
};

const mapStateToProps = (state) => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	swapTxHashWithLoanID,
	updateLoan,
	fetchWalletBalancesRequest,
	fetchLoansContractInfo,
	fetchRatesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlobalEventsGate);
