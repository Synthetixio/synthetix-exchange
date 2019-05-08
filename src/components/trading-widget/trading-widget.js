import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numbro from 'numbro';

import GweiSelector from '../gwei-selector';
import { TRANSACTION_REJECTED } from '../../utils/walletErrors';
import {
  getCurrentWalletInfo,
  getSynthToBuy,
  getSynthToExchange,
  getExchangeRates,
  getCurrentExchangeMode,
} from '../../ducks/';
import { toggleTransactionStatusPopup } from '../../ducks/ui';
import {
  setTransactionStatusToConfirm,
  setTransactionStatusToProgress,
  setTransactionStatusToSuccess,
  setTransactionStatusToCleared,
  setTransactionStatusToError,
  setTransactionPair,
} from '../../ducks/wallet';

import synthetixJsTools from '../../synthetixJsTool';

import styles from './trading-widget.module.scss';

class TradingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: {},
      transactionSpeed: 'average',
      gasAndSpeedInfo: null,
    };
    this.onFromSynthChange = this.onFromSynthChange.bind(this);
    this.onToSynthChange = this.onToSynthChange.bind(this);
    this.tradeMax = this.tradeMax.bind(this);
    this.confirmTrade = this.confirmTrade.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { synthToBuy, synthToExchange } = this.props;
    if (prevProps.synthToBuy !== synthToBuy) {
      const synthToBuyValue = this.state.inputValues[prevProps.synthToBuy];
      this.setState(
        {
          inputValues: {
            ...this.state.inputValues,
            [synthToBuy.name]: synthToBuyValue,
          },
        },
        this.onFromSynthChange
      );
    }

    if (prevProps.synthToExchange !== synthToExchange) {
      this.resetInputs();
    }
  }

  resetInputs() {
    const { synthToBuy, synthToExchange } = this.props;
    this.setState({
      inputValues: { [synthToExchange.name]: 0, [synthToBuy.name]: 0 },
    });
  }

  tradeMax() {
    const {
      currentWalletInfo,
      synthToExchange,
      synthToBuy,
      exchangeRates,
    } = this.props;
    const { balances } = currentWalletInfo;
    const synthToExchangeBalance = balances[synthToExchange.name];
    const conversionToMax = this.convert(
      synthToBuy.name,
      synthToExchangeBalance,
      exchangeRates[synthToExchange.name]
    );
    this.setState({
      inputValues: {
        [synthToExchange.name]: synthToExchangeBalance,
        [synthToBuy.name]: conversionToMax,
      },
    });
  }

  async confirmTrade() {
    const {
      synthToExchange,
      synthToBuy,
      currentWalletInfo,
      toggleTransactionStatusPopup,
      setTransactionStatusToConfirm,
      setTransactionStatusToProgress,
      setTransactionStatusToSuccess,
      setTransactionStatusToCleared,
      setTransactionStatusToError,
      setTransactionPair,
    } = this.props;
    const { inputValues } = this.state;
    const {
      selectedWallet,
      walletType,
      gasPrice,
      gasLimit,
    } = currentWalletInfo;
    let transactionResult;
    if (
      !synthetixJsTools.initialized ||
      !currentWalletInfo ||
      !currentWalletInfo.selectedWallet
    )
      return;

    const fromAmount = inputValues[synthToExchange.name];
    const toAmount = inputValues[synthToBuy.name];
    try {
      toggleTransactionStatusPopup(true);
      setTransactionStatusToConfirm();
      setTransactionPair({
        fromSynth: synthToExchange,
        toSynth: synthToBuy,
        fromAmount,
        toAmount,
      });
      transactionResult = await synthetixJsTools.synthetixJs.Synthetix.exchange(
        synthetixJsTools.utils.toUtf8Bytes(synthToExchange.name),
        synthetixJsTools.utils.parseEther(fromAmount),
        synthetixJsTools.utils.toUtf8Bytes(synthToBuy.name),
        selectedWallet,
        {
          gasPrice,
          gasLimit,
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
          this.resetInputs();
        }, 2000);
      } catch (e) {
        console.log('Could not get transaction confirmation', e);
      }
    }
  }

  convert(to, value, rates) {
    const toRate = rates[to];
    return (value * toRate).toString();
  }

  onFromSynthChange(e) {
    const { exchangeRates, synthToExchange, synthToBuy } = this.props;

    const { inputValues } = this.state;
    const currentInputValue = inputValues[synthToExchange.name] || 0;
    const newInputValue =
      e && e.target.validity.valid ? e.target.value : currentInputValue;

    const convertedInputValue = this.convert(
      synthToBuy.name,
      Number(newInputValue),
      exchangeRates[synthToExchange.name]
    );
    this.setState({
      inputValues: {
        [synthToExchange.name]: newInputValue,
        [synthToBuy.name]: convertedInputValue,
      },
    });
  }

  onToSynthChange(e) {
    const { exchangeRates, synthToExchange, synthToBuy } = this.props;
    const { inputValues } = this.state;
    const currentInputValue = inputValues[synthToBuy] || 0;
    const newInputValue =
      e && e.target.validity.valid ? e.target.value : currentInputValue;

    const convertedInputValue = this.convert(
      synthToExchange.name,
      Number(newInputValue),
      exchangeRates[synthToBuy.name]
    );
    this.setState({
      inputValues: {
        [synthToExchange.name]: convertedInputValue,
        [synthToBuy.name]: newInputValue,
      },
    });
  }

  renderInput(synth, handler) {
    const { inputValues } = this.state;
    return (
      <div className={styles.widgetInputWrapper}>
        <input
          className={styles.widgetInputElement}
          type="text"
          value={(inputValues && inputValues[synth]) || ''}
          placeholder={0}
          onChange={handler}
          pattern="^-?[0-9]\d*\.?\d*$"
        />
        <div className={styles.widgetInputSynth}>
          <img src={`images/synths/${synth}-icon.svg`} alt="synth icon" />
          <span>{synth}</span>
        </div>
      </div>
    );
  }

  renderInputs() {
    const { synthToBuy, synthToExchange } = this.props;
    return (
      <div className={styles.widgetInputs}>
        {this.renderInput(synthToExchange.name, this.onFromSynthChange)}
        {this.renderInput(synthToBuy.name, this.onToSynthChange)}
      </div>
    );
  }

  renderPairRate() {
    const {
      synthToBuy,
      synthToExchange,
      currentExchangeMode,
      exchangeRates,
    } = this.props;
    if (currentExchangeMode === 'pro' || !exchangeRates) return;
    const precision =
      synthToBuy.name === 'sXAU' &&
      (synthToExchange.name === 'sKRW' || synthToExchange.name === 'sJPY')
        ? '0,0.00000000'
        : '0,0.00000';
    const rate = exchangeRates[synthToBuy.name][synthToExchange.name];
    return (
      <div className={styles.pairRate}>
        <div className={styles.pairRateName}>{`${synthToBuy.name}/${
          synthToExchange.name
        }:`}</div>
        {synthToExchange.sign}
        {numbro(rate).format(precision)}
      </div>
    );
  }

  render() {
    const { synthToBuy, synthToExchange, currentWalletInfo } = this.props;

    const { selectedWallet } = currentWalletInfo;
    const { inputValues } = this.state;
    const buttonIsEnabled =
      inputValues[synthToBuy.name] && inputValues[synthToExchange.name];
    return (
      <div
        className={`${styles.widget} ${
          !selectedWallet ? styles.widgetIsDisabled : ''
        }`}
      >
        <div className={styles.widgetHeader}>
          <h2>Trade</h2>
          <button onClick={this.tradeMax} className={styles.widgetHeaderButton}>
            Trade Max
          </button>
        </div>
        {this.renderPairRate()}
        {this.renderInputs()}
        <GweiSelector />
        <button
          disabled={!buttonIsEnabled}
          onClick={this.confirmTrade}
          className={styles.widgetTradingButton}
        >
          Confirm Trade
        </button>
        {!selectedWallet ? (
          <Fragment>
            <div className={styles.widgetOverlay} />
            <div className={styles.widgetOverlayMessage}>
              Please connect your wallet
            </div>
          </Fragment>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    synthToBuy: getSynthToBuy(state),
    synthToExchange: getSynthToExchange(state),
    exchangeRates: getExchangeRates(state),
    currentExchangeMode: getCurrentExchangeMode(state),
  };
};

const mapDispatchToProps = {
  toggleTransactionStatusPopup,
  setTransactionStatusToConfirm,
  setTransactionStatusToProgress,
  setTransactionStatusToSuccess,
  setTransactionStatusToCleared,
  setTransactionStatusToError,
  setTransactionPair,
};

TradingWidget.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  synthToBuy: PropTypes.object,
  synthToExchange: PropTypes.object.isRequired,
  exchangeRates: PropTypes.object,
  toggleTransactionStatusPopup: PropTypes.func.isRequired,
  setTransactionStatusToConfirm: PropTypes.func.isRequired,
  setTransactionStatusToProgress: PropTypes.func.isRequired,
  setTransactionStatusToSuccess: PropTypes.func.isRequired,
  setTransactionStatusToCleared: PropTypes.func.isRequired,
  setTransactionPair: PropTypes.func.isRequired,
  currentExchangeMode: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TradingWidget);
