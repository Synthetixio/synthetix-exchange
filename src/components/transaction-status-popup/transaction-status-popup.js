import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numbro from 'numbro';

import Popup from '../popup';
import Spinner from '../spinner';

import { toggleTransactionStatusPopup } from '../../ducks/ui';
import { getCurrentWalletInfo, getExchangeFeeRate } from '../../ducks/';

import { SUPPORTED_NETWORKS } from '../../utils/metamaskTools';

import styles from './transaction-status.module.scss';

class TransactionStatusPopup extends Component {
  constructor() {
    super();
    this.closePopup = this.closePopup.bind(this);
    this.goToEtherscan = this.goToEtherscan.bind(this);
  }

  closePopup() {
    const { toggleTransactionStatusPopup } = this.props;
    toggleTransactionStatusPopup(false);
  }

  renderAmount(amount, synth) {
    return (
      <div className={styles.conversionAmount}>
        <span className={styles.conversionAmountValue}>
          {numbro(amount).format('0,0.00')}
        </span>
        <span className={styles.conversionAmountSynth}>{synth.name}</span>
      </div>
    );
  }

  renderFees() {
    const { currentWalletInfo, exchangeFeeRate } = this.props;
    const { gasPriceUsd } = currentWalletInfo;
    return (
      <div>
        <div className={styles.feeRow}>
          <span className={styles.feeRowHeading}>Ethereum Network fees</span>
          <span className={styles.feeRowValue}>${gasPriceUsd}</span>
        </div>
        <div className={styles.feeRow}>
          <span className={styles.feeRowHeading}>Exchange fee rate</span>
          <span className={styles.feeRowValue}>{exchangeFeeRate}%</span>
        </div>
      </div>
    );
  }

  renderConfirmationContent() {
    const { currentWalletInfo } = this.props;
    if (!currentWalletInfo.walletType) return null;
    const { walletType, transactionPair } = currentWalletInfo;
    const { fromSynth, toSynth, fromAmount, toAmount } = transactionPair;
    return (
      <div>
        <img
          src={`images/wallets/${walletType.toLowerCase()}-big.svg`}
          alt={`${walletType} logo`}
        />
        <h1>Please confirm the transaction</h1>
        <p className={styles.explanationParagraph}>
          To continue, please confirm the trade via{' '}
          {walletType !== 'Metamask' ? 'your ' : ''}
          {walletType}
        </p>
        <Spinner small={true} />
        <div className={styles.transactionPair}>
          {this.renderAmount(fromAmount, fromSynth)}
          <img
            height={11}
            src="images/transaction-icon.svg"
            alt="transaction icon"
          />
          {this.renderAmount(toAmount, toSynth)}
        </div>
        {this.renderFees()}
      </div>
    );
  }

  goToEtherscan() {
    const { currentWalletInfo } = this.props;
    const { transactionHash, networkId } = currentWalletInfo;
    let networkName = SUPPORTED_NETWORKS[networkId];
    networkName = (networkName && networkName.toLowerCase()) || '';
    if (networkName === 'mainnet') {
      networkName = '';
    }
    window.open(
      `https://${
        networkName ? networkName + '.' : ''
      }etherscan.io/tx/${transactionHash}`
    );
  }

  renderWaitForSuccessContent(success) {
    return (
      <div>
        <img
          src="images/transaction-in-progress.svg"
          alt="transaction in progress"
        />
        <h1>Transaction {!success ? 'in progress' : 'Success'}</h1>
        {!success ? <Spinner small={true} /> : null}
        <button
          className={styles.buttonVerifyTransaction}
          onClick={this.goToEtherscan}
        >
          Verify Transaction
        </button>
      </div>
    );
  }

  renderErrorContent() {
    const { currentWalletInfo } = this.props;
    const errorMessageTitle =
      currentWalletInfo.transactionErrorType === 'rejected'
        ? 'Transaction was rejected'
        : 'Transaction failed';
    const errorMessageDescription =
      currentWalletInfo.transactionErrorType === 'rejected'
        ? 'You did not confirm the transaction.'
        : 'An error occured during the transaction.';
    return (
      <div>
        <img src="images/transaction-error.svg" alt="transaction error" />
        <h1>{errorMessageTitle}</h1>
        <p className={styles.errorDescription}>{errorMessageDescription}</p>
        <button
          className={styles.buttonVerifyTransaction}
          onClick={this.closePopup}
        >
          Back
        </button>
      </div>
    );
  }

  renderPopupContent(transactionStatus) {
    switch (transactionStatus) {
      case 'confirm':
        return this.renderConfirmationContent();
      case 'progress':
        return this.renderWaitForSuccessContent(false);
      case 'success':
        return this.renderWaitForSuccessContent(true);
      case 'error':
        return this.renderErrorContent();
      default:
        return null;
    }
  }

  render() {
    const { isVisible, currentWalletInfo } = this.props;
    if (!currentWalletInfo.walletType) return null;
    const { transactionStatus } = currentWalletInfo;

    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div className={styles.transactionStatusPopup}>
          {this.renderPopupContent(transactionStatus)}
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    exchangeFeeRate: getExchangeFeeRate(state),
  };
};

const mapDispatchToProps = {
  toggleTransactionStatusPopup,
};

TransactionStatusPopup.propTypes = {
  toggleTransactionStatusPopup: PropTypes.func.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
  exchangeFeeRate: PropTypes.number,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionStatusPopup);
