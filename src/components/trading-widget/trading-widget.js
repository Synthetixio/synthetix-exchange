import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numbro from 'numbro';

import GweiSelector from '../gwei-selector';
import TradingWidgetInput from './trading-widget-input';

import { TRANSACTION_REJECTED } from '../../utils/walletErrors';
import {
  getCurrentWalletInfo,
  getSynthToBuy,
  getSynthToExchange,
  getExchangeRates,
  getCurrentExchangeMode,
  getAvailableSynths,
  getFrozenSynths,
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
import { setSynthToExchange, setSynthToBuy } from '../../ducks/synths';

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
    this.setSynthToBuy = this.setSynthToBuy.bind(this);
    this.setSynthToExchange = this.setSynthToExchange.bind(this);
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
        synthetixJsTools.getUtf8Bytes(synthToExchange.name),
        synthetixJsTools.utils.parseEther(fromAmount),
        synthetixJsTools.getUtf8Bytes(synthToBuy.name),
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

  setSynthToBuy(synth) {
    const { setSynthToBuy } = this.props;
    setSynthToBuy(synth);
  }

  setSynthToExchange(synth) {
    const { setSynthToExchange } = this.props;
    setSynthToExchange(synth);
  }

  renderInputs() {
    const { synthToBuy, synthToExchange, frozenSynths } = this.props;
    const { inputValues } = this.state;
    return (
      <div className={styles.widgetInputs}>
        <TradingWidgetInput
          value={(inputValues && inputValues[synthToExchange.name]) || ''}
          onInputChange={this.onFromSynthChange}
          currentSynth={synthToExchange.name}
          onSynthSelect={this.setSynthToExchange}
        />
        <TradingWidgetInput
          value={(inputValues && inputValues[synthToBuy.name]) || ''}
          onInputChange={this.onToSynthChange}
          currentSynth={synthToBuy.name}
          onSynthSelect={this.setSynthToBuy}
          filterNotNeeded={true}
          isFrozen={frozenSynths && frozenSynths[synthToBuy.name]}
        />
      </div>
    );
  }

  renderPairRateAndBalance() {
    const {
      synthToBuy,
      synthToExchange,
      currentExchangeMode,
      exchangeRates,
      currentWalletInfo,
    } = this.props;
    const { balances } = currentWalletInfo;

    if (currentExchangeMode === 'pro' || !exchangeRates) return;
    const precision =
      synthToBuy.name === 'sXAU' &&
      (synthToExchange.name === 'sKRW' || synthToExchange.name === 'sJPY')
        ? '0,0.00000000'
        : '0,0.00000';
    const rate = exchangeRates[synthToBuy.name][synthToExchange.name];
    return (
      <div className={styles.pairRateAndBalanceRow}>
        <div className={styles.pairRate}>
          <div className={styles.pairRateName}>{`${synthToBuy.name}/${
            synthToExchange.name
          }:`}</div>
          {synthToExchange.sign}
          {numbro(rate).format(precision)}
        </div>
        <div className={styles.balance}>
          <div className={styles.pairRateName}>
            {synthToExchange.name} balance:
          </div>
          <div>
            {synthToExchange.sign}
            {balances &&
            balances[synthToExchange.name] &&
            Number(balances[synthToExchange.name]) > 0
              ? numbro(Number(balances[synthToExchange.name])).format(
                  '0,0.0000'
                )
              : 0}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      synthToBuy,
      synthToExchange,
      currentWalletInfo,
      frozenSynths,
    } = this.props;
    const { selectedWallet, balances } = currentWalletInfo;
    const { inputValues } = this.state;

    const quoteSynthIsFrozen = frozenSynths && frozenSynths[synthToBuy.name];
    const confirmTradeButtonIsEnabled =
      inputValues[synthToBuy.name] &&
      inputValues[synthToExchange.name] &&
      Number(balances[synthToExchange.name]) > 0;
    const tradeMaxButtonIsEnabled =
      balances && Number(balances[synthToExchange.name]) > 0;
    return (
      <div
        className={`${styles.widget} ${
          !selectedWallet ? styles.widgetIsDisabled : ''
        }`}
      >
        <div className={styles.widgetHeader}>
          <h2>Trade</h2>
          <button
            disabled={!tradeMaxButtonIsEnabled}
            onClick={this.tradeMax}
            className={styles.widgetHeaderButton}
          >
            Trade Max
          </button>
        </div>
        {this.renderPairRateAndBalance()}
        {this.renderInputs()}
        <GweiSelector />
        <button
          disabled={!confirmTradeButtonIsEnabled || quoteSynthIsFrozen}
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
    availableSynths: getAvailableSynths(state),
    frozenSynths: getFrozenSynths(state),
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
  setSynthToExchange,
  setSynthToBuy,
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
  availableSynths: PropTypes.array,
  setSynthToExchange: PropTypes.func.isRequired,
  setSynthToBuy: PropTypes.func.isRequired,
  frozenSynths: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TradingWidget);
