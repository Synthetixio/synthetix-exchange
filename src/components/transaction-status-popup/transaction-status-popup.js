import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import Popup from '../popup';
import Spinner from '../spinner';

import { toggleTransactionStatusPopup } from '../../ducks/ui';
import { getCurrentWalletInfo } from '../../ducks/';

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
          {numeral(amount).format('0,0.00')}
        </span>
        <span className={styles.conversionAmountSynth}>{synth}</span>
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
        <h1>Please confirm transaction</h1>
        <p className={styles.explanationParagraph}>
          To continue, please confirm the trade via {walletType}
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
    const network = window.open(
      `https://${
        networkName ? networkName + '.' : ''
      }etherscan.io/tx/${transactionHash}`
    );
  }

  renderWaitForSuccessContent(success) {
    return (
      <div>
        <h1>Transaction {!success ? 'Confirmed' : 'Successed'}</h1>
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

  renderPopupContent(transactionStatus) {
    switch (transactionStatus) {
      case 'confirm':
        return this.renderConfirmationContent();
      case 'progress':
        return this.renderWaitForSuccessContent(false);
      case 'success':
        return this.renderWaitForSuccessContent(true);
      case 'error':
        return 'error';
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
  };
};

const mapDispatchToProps = {
  toggleTransactionStatusPopup,
  // changeScreen,
  // connectToWallet,
  // setSelectedWallet,
};

TransactionStatusPopup.propTypes = {
  toggleTransactionStatusPopup: PropTypes.func.isRequired,
  // changeScreen: PropTypes.func.isRequired,
  // connectToWallet: PropTypes.func.isRequired,
  // setSelectedWallet: PropTypes.func.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TransactionStatusPopup);
