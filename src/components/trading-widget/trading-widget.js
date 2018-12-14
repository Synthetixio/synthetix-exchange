import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  getCurrentWalletInfo,
  getSynthToBuy,
  getSynthToExchange,
} from '../../ducks/';

import styles from './trading-widget.module.scss';

class TradingWidget extends Component {
  constructor() {
    super();
    this.state = {
      inputValues: {},
    };
  }

  onInputChange(synth) {
    return e => {
      const { inputValues } = this.state;
      const currentInputValue = inputValues[synth] || 0;
      const newInputValue = e.target.validity.valid
        ? e.target.value
        : currentInputValue;
      this.setState({
        inputValues: { ...inputValues, [synth]: newInputValue },
      });
    };
  }

  renderInputs() {
    const { synthToBuy, synthToExchange } = this.props;
    const { inputValues } = this.state;
    const inputs = [synthToExchange, synthToBuy].map(synth => {
      return (
        <div className={styles.widgetInputWrapper}>
          <input
            className={styles.widgetInputElement}
            type="text"
            value={inputValues[synth]}
            onChange={this.onInputChange(synth)}
            pattern="^-?[0-9]\d*\.?\d*$"
          />
          <div className={styles.widgetInputSynth}>
            <img src={`images/synths/${synth}-icon.svg`} alt="synth icon" />
            <span>{synth}</span>
          </div>
        </div>
      );
    });
    return <div className={styles.widgetInputs}>{inputs}</div>;
  }
  render() {
    return (
      <div>
        <div className={styles.widgetHeader}>
          <h2>Trade</h2>
          <button className={styles.widgetHeaderButton}>Trade Max</button>
        </div>
        {this.renderInputs()}
        <button className={styles.widgetTradingButton}>Confirm Trade</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    synthToBuy: getSynthToBuy(state),
    synthToExchange: getSynthToExchange(state),
  };
};

const mapDispatchToProps = {};

TradingWidget.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  synthToBuy: PropTypes.string.isRequired,
  synthToExchange: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TradingWidget);
