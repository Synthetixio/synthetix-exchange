import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getCurrentWalletInfo,
  getSynthToBuy,
  getSynthToExchange,
  getExchangeRates,
} from '../../ducks/';

import synthetixJsTools from '../../synthetixJsTool';

import styles from './trading-widget.module.scss';

class TradingWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValues: {
        [props.synthToExchange]: '',
        [props.synthToBuy]: '',
      },
    };
    this.onFromSynthChange = this.onFromSynthChange.bind(this);
    this.onToSynthChange = this.onToSynthChange.bind(this);
    this.tradeMax = this.tradeMax.bind(this);
    this.confirmTrade = this.confirmTrade.bind(this);
  }

  tradeMax() {
    const {
      currentWalletInfo,
      synthToExchange,
      synthToBuy,
      exchangeRates,
    } = this.props;
    const { balances } = currentWalletInfo;
    const synthToExchangeBalance = balances[synthToExchange];
    const conversionToMax = this.convert(
      synthToBuy,
      synthToExchangeBalance,
      exchangeRates[synthToExchange]
    );
    this.setState({
      inputValues: {
        [synthToExchange]: synthToExchangeBalance,
        [synthToBuy]: conversionToMax,
      },
    });
  }

  async confirmTrade() {
    const { synthToExchange, synthToBuy, currentWalletInfo } = this.props;
    const { inputValues } = this.state;
    const { selectedWallet } = currentWalletInfo;
    if (
      !synthetixJsTools.initialized ||
      !currentWalletInfo ||
      !currentWalletInfo.selectedWallet
    )
      return;

    const fromSynth = synthetixJsTools.utils.toUtf8Bytes(synthToExchange);
    const toSynth = synthetixJsTools.utils.toUtf8Bytes(synthToBuy);
    const amount = synthetixJsTools.utils.parseEther(
      inputValues[synthToExchange]
    );
    try {
      synthetixJsTools.havvenJs.Synthetix.exchange(
        fromSynth,
        amount,
        toSynth,
        selectedWallet
      );
    } catch (e) {
      console.log('Error during exchange', e);
    }
  }

  convert(to, value, rates) {
    const toRate = rates.find(rate => rate.synth === to);
    return value * toRate.rate;
  }

  onFromSynthChange(e) {
    const { exchangeRates, synthToExchange, synthToBuy } = this.props;

    const { inputValues } = this.state;
    const currentInputValue = inputValues[synthToExchange] || 0;
    const newInputValue = e.target.validity.valid
      ? e.target.value
      : currentInputValue;

    const convertedInputValue = this.convert(
      synthToBuy,
      Number(newInputValue),
      exchangeRates[synthToExchange]
    );

    this.setState({
      inputValues: {
        [synthToExchange]: newInputValue,
        [synthToBuy]: convertedInputValue,
      },
    });
  }

  onToSynthChange(e) {
    const { exchangeRates, synthToExchange, synthToBuy } = this.props;
    const { inputValues } = this.state;
    const currentInputValue = inputValues[synthToBuy] || 0;
    const newInputValue = e.target.validity.valid
      ? e.target.value
      : currentInputValue;

    const convertedInputValue = this.convert(
      synthToExchange,
      Number(newInputValue),
      exchangeRates[synthToBuy]
    );

    this.setState({
      inputValues: {
        [synthToExchange]: convertedInputValue,
        [synthToBuy]: newInputValue,
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
          value={inputValues[synth]}
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
        {this.renderInput(synthToExchange, this.onFromSynthChange)}
        {this.renderInput(synthToBuy, this.onToSynthChange)}
      </div>
    );
  }
  render() {
    return (
      <div>
        <div className={styles.widgetHeader}>
          <h2>Trade</h2>
          <button onClick={this.tradeMax} className={styles.widgetHeaderButton}>
            Trade Max
          </button>
        </div>
        {this.renderInputs()}
        <button
          onClick={this.confirmTrade}
          className={styles.widgetTradingButton}
        >
          Confirm Trade
        </button>
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
  };
};

const mapDispatchToProps = {};

TradingWidget.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  synthToBuy: PropTypes.string.isRequired,
  synthToExchange: PropTypes.string.isRequired,
  exchangeRates: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TradingWidget);
