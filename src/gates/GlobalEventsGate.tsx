import { useEffect, FC } from 'react';
import { connect } from 'react-redux';

import {
	updateLoan,
	swapTxHashWithLoanID,
	// LOAN_STATUS
} from 'ducks/loans/myLoans';
import { fetchWalletBalancesRequest } from 'ducks/wallet/walletBalances';
import { getCurrentWalletAddress } from 'ducks/wallet/walletDetails';
import { fetchRatesRequest } from 'ducks/rates';
import { fetchLoansContractInfo } from 'ducks/loans/contractInfo';
import { RootState } from 'ducks/types';
import { setSystemSuspended } from 'ducks/app';

import snxJSConnector from 'utils/snxJSConnector';

import {
	// LOAN_EVENTS,
	EXCHANGE_RATES_EVENTS,
	EXCHANGE_EVENTS,
	SYSTEM_STATUS_EVENTS,
} from 'constants/events';

type StateProps = {
	currentWallet: string | null;
};

type DispatchProps = {
	swapTxHashWithLoanID: typeof swapTxHashWithLoanID;
	updateLoan: typeof updateLoan;
	fetchWalletBalancesRequest: typeof fetchWalletBalancesRequest;
	fetchLoansContractInfo: typeof fetchLoansContractInfo;
	fetchRatesRequest: typeof fetchRatesRequest;
	setSystemSuspended: typeof setSystemSuspended;
};

type GlobalEventsGateProps = StateProps & DispatchProps;

const GlobalEventsGate: FC<GlobalEventsGateProps> = ({
	// updateLoan,
	fetchWalletBalancesRequest,
	// fetchLoansContractInfo,
	// swapTxHashWithLoanID,
	// fetchRatesRequest,
	currentWallet,
	setSystemSuspended,
}) => {
	useEffect(() => {
		const {
			snxJS: {
				// EtherCollateral,
				ExchangeRates,
				SystemStatus,
			},
		} = snxJSConnector as any;

		// EtherCollateral.contract.on(
		// 	LOAN_EVENTS.LOAN_CREATED,
		// 	(_account: string, loanID: string, _amount: string, tx: { transactionHash: string }) => {
		// 		fetchLoansContractInfo();
		// 		fetchWalletBalancesRequest();

		// 		const { transactionHash } = tx;
		// 		const loanIDNumber = Number(loanID);

		// 		updateLoan({
		// 			transactionHash,
		// 			loanInfo: {
		// 				loanID: loanIDNumber,
		// 				status: LOAN_STATUS.OPEN,
		// 			},
		// 			swapTransactionHashWithLoanID: true,
		// 		});

		// 		swapTxHashWithLoanID({
		// 			transactionHash,
		// 			loanID: loanIDNumber,
		// 		});
		// 	}
		// );

		// EtherCollateral.contract.on(LOAN_EVENTS.LOAN_CLOSED, (_: any, loanID: string) => {
		// 	fetchLoansContractInfo();
		// 	fetchWalletBalancesRequest();
		// 	updateLoan({
		// 		loanID: Number(loanID),
		// 		loanInfo: {
		// 			status: LOAN_STATUS.CLOSED,
		// 		},
		// 	});
		// });

		ExchangeRates.contract.on(EXCHANGE_RATES_EVENTS.RATES_UPDATED, fetchRatesRequest);
		SystemStatus.contract.on(SYSTEM_STATUS_EVENTS.SYSTEM_SUSPENDED, () => {
			setSystemSuspended({ status: true });
		});

		SystemStatus.contract.on(SYSTEM_STATUS_EVENTS.SYSTEM_RESUMED, () => {
			setSystemSuspended({ status: false });
		});

		return () => {
			// Object.values(LOAN_EVENTS).forEach((event) =>
			// 	EtherCollateral.contract.removeAllListeners(event)
			// );
			Object.values(EXCHANGE_RATES_EVENTS).forEach((event) =>
				ExchangeRates.contract.removeAllListeners(event)
			);
			Object.values(SYSTEM_STATUS_EVENTS).forEach((event) =>
				SystemStatus.contract.removeAllListeners(event)
			);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!currentWallet) return;
		const {
			snxJS: { Synthetix },
		} = snxJSConnector as any;

		Synthetix.contract.on(EXCHANGE_EVENTS.SYNTH_EXCHANGE, (address: string) => {
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

const mapStateToProps = (state: RootState): StateProps => ({
	currentWallet: getCurrentWalletAddress(state),
});

const mapDispatchToProps: DispatchProps = {
	swapTxHashWithLoanID,
	updateLoan,
	fetchWalletBalancesRequest,
	fetchLoansContractInfo,
	fetchRatesRequest,
	setSystemSuspended,
};

export default connect<StateProps, DispatchProps, {}, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(GlobalEventsGate as any);
