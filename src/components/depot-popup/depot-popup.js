import React, { Component } from 'react';
import { connect } from 'react-redux';
import numbro from 'numbro';
import PropTypes from 'prop-types';

import Popup from '../popup';
import GweiSelector from '../gwei-selector';
import { TRANSACTION_REJECTED } from '../../utils/walletErrors';

import { toggleDepotPopup, toggleTransactionStatusPopup } from '../../ducks/ui';
import {
  setTransactionStatusToConfirm,
  setTransactionStatusToProgress,
  setTransactionStatusToSuccess,
  setTransactionStatusToCleared,
  setTransactionStatusToError,
  setTransactionPair,
} from '../../ducks/wallet';
import { getCurrentWalletInfo, getEthRate } from '../../ducks';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import styles from './depot-popup.module.scss';

class DepotPopup extends Component {
  constructor() {
    super();
    this.state = {
      ethInputValue: 0,
      synthInputValue: '',
      ethBalance: null,
    };
    this.closePopup = this.closePopup.bind(this);
    this.onBuyMaxClick = this.onBuyMaxClick.bind(this);
    this.onEthInputChange = this.onEthInputChange.bind(this);
    this.onSynthInputChange = this.onSynthInputChange.bind(this);
    this.buyFromDepot = this.buyFromDepot.bind(this);
  }

  closePopup() {
    const { toggleDepotPopup } = this.props;
    toggleDepotPopup(false);
  }

  async buyFromDepot() {
    const { ethInputValue, synthInputValue } = this.state;
    const {
      currentWalletInfo,
      toggleDepotPopup,
      toggleTransactionStatusPopup,
      setTransactionStatusToConfirm,
      setTransactionStatusToProgress,
      setTransactionStatusToSuccess,
      setTransactionStatusToCleared,
      setTransactionStatusToError,
      setTransactionPair,
    } = this.props;
    const { gasPrice, gasLimit, walletType } = currentWalletInfo;
    let transactionResult;
    try {
      toggleDepotPopup(false);
      toggleTransactionStatusPopup(true);
      setTransactionStatusToConfirm();
      setTransactionPair({
        fromSynth: 'ETH',
        toSynth: 'sUSD',
        fromAmount: ethInputValue,
        toAmount: synthInputValue,
      });
      transactionResult = await synthetixJsTools.havvenJs.Depot.exchangeEtherForSynths(
        {
          gasPrice,
          gasLimit,
          value: synthetixJsTools.utils.parseEther(ethInputValue),
        }
      );
    } catch (e) {
      const transactionRejected =
        e.message && e.message.includes(TRANSACTION_REJECTED[walletType]);
      setTransactionStatusToError(transactionRejected ? 'rejected' : 'failed');
      console.log('Error during the exchange transaction', e);
    }
    if (transactionResult) {
      const hash = transactionResult.hash || transactionResult;
      setTransactionStatusToProgress(hash);
      try {
        await synthetixJsTools.util.waitForTransaction(hash);
        setTransactionStatusToSuccess();
        setTimeout(() => {
          toggleTransactionStatusPopup(false);
          setTransactionStatusToCleared();
        }, 2000);
      } catch (e) {
        console.log('Could not get transaction confirmation', e);
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      const { currentWalletInfo } = this.props;
      const { initialized, provider } = synthetixJsTools;
      if (
        !initialized ||
        !currentWalletInfo ||
        !currentWalletInfo.selectedWallet
      )
        return;
      const { selectedWallet } = currentWalletInfo;
      const ethBalance = await provider.getBalance(selectedWallet);
      this.setState({ ethBalance: formatBigNumber(ethBalance, 6) });
    }
  }

  onEthInputChange(e) {
    const { ethRate } = this.props;
    const { ethInputValue } = this.state;
    const newInputValue =
      e && e.target.validity.valid ? e.target.value : ethInputValue;
    const synthInputValue = newInputValue * ethRate;
    this.setState({
      ethInputValue: newInputValue,
      synthInputValue,
    });
  }

  onSynthInputChange(e) {
    const { ethRate } = this.props;
    const { synthInputValue } = this.state;
    const newInputValue =
      e && e.target.validity.valid ? e.target.value : synthInputValue;
    const ethInputValue = newInputValue / ethRate;
    this.setState({
      ethInputValue: ethInputValue.toString(),
      synthInputValue: newInputValue,
    });
  }

  onBuyMaxClick() {
    const { ethBalance } = this.state;
    this.setState({ ethInputValue: ethBalance }, this.onEthInputChange);
  }

  renderEthBalance() {
    const { ethBalance } = this.state;
    return (
      <div className={styles.ethBalance}>
        <span>ETH Balance</span>
        <span className={styles.ethBalanceValue}>
          {ethBalance ? numbro(ethBalance).format('0,0.00') : '0.00'}
        </span>
      </div>
    );
  }
  render() {
    const { isVisible } = this.props;
    const { ethInputValue, synthInputValue } = this.state;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div className={styles.depotPopup}>
          <h1>Buy sUSD with ETH</h1>
          <p className={styles.popupDescription}>
            Here you can purchase sUSD through our Depot, which is a platform
            available through Mintr and Swappr that allows sUSD buyers to buy
            from SNX holders who have minted sUSD.{' '}
          </p>
          {this.renderEthBalance()}
          <div className={styles.inputLabelRow}>
            <span>Amount</span>
            <button
              className={styles.buyMaxButton}
              onClick={this.onBuyMaxClick}
            >
              Buy Max
            </button>
          </div>
          <div className={styles.inputRow}>
            <input
              value={ethInputValue || ''}
              placeholder={0}
              onChange={this.onEthInputChange}
              pattern="^-?[0-9]\d*\.?\d*$"
              className={styles.inputElement}
              type="text"
            />
            <img src="/images/swap-icon.svg" />
            <input
              value={synthInputValue || ''}
              placeholder={0}
              onChange={this.onSynthInputChange}
              pattern="^-?[0-9]\d*\.?\d*$"
              className={styles.inputElement}
              type="text"
            />
          </div>
          <GweiSelector />
          <button
            className={styles.buyButton}
            type="button"
            onClick={this.buyFromDepot}
          >
            Buy
          </button>
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    ethRate: getEthRate(state),
  };
};
const mapDispatchToProps = {
  toggleDepotPopup,
  toggleTransactionStatusPopup,
  setTransactionStatusToConfirm,
  setTransactionStatusToProgress,
  setTransactionStatusToSuccess,
  setTransactionStatusToCleared,
  setTransactionStatusToError,
  setTransactionPair,
};

DepotPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
  toggleDepotPopup: PropTypes.func.isRequired,
  toggleTransactionStatusPopup: PropTypes.func.isRequired,
  ethRate: PropTypes.string,
  setTransactionStatusToConfirm: PropTypes.func.isRequired,
  setTransactionStatusToProgress: PropTypes.func.isRequired,
  setTransactionStatusToSuccess: PropTypes.func.isRequired,
  setTransactionStatusToCleared: PropTypes.func.isRequired,
  setTransactionStatusToError: PropTypes.func.isRequired,
  setTransactionPair: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepotPopup);
