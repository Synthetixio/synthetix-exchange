import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import {
  getCurrentWalletInfo,
  getSynthToBuy,
  getSynthToExchange,
} from '../../ducks/';

import styles from './trading-widget.module.scss';

class SynthTransaction extends Component {
  renderInputs() {
    const { synthToBuy, synthToExchange } = this.props;
    const inputs = [synthToExchange, synthToBuy].map(synth => {
      return (
        <div className={styles.widgetInputWrapper}>
          <input
            className={styles.widgetInputElement}
            type="text"
            value={'0.00'}
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

SynthTransaction.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  synthToBuy: PropTypes.string.isRequired,
  synthToExchange: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SynthTransaction);
