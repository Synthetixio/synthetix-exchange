import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import styles from './synth-picker.module.scss';

import {
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
} from '../../ducks/';
import { setSynthToExchange } from '../../ducks/synths';

class SynthPicker extends Component {
  render() {
    const { availableSynths } = this.props;

    return (
      <div className={styles.synthPickerWrapper}>
        <div className={styles.synthPicker}>
          <div className={styles.synthPickerValue}>
            <div>
              <img src={`/images/synths/${'sUSD'}-icon.svg`} />
              {'sUSD'}
            </div>
            <div>250.00</div>
          </div>
          <div className={styles.synthPickerBox}>
            <div className={styles.synthTable}>
              <div className={styles.synthTableHeader}>
                <button className={styles.synthTableButton}>Crypto</button>
                <button className={`${styles.synthTableButton} ${''}`}>
                  Commodities
                </button>
                <button
                  className={`${styles.synthTableButton} ${
                    styles.synthTableButtonIsActive
                  }`}
                >
                  Forex
                </button>
              </div>
              <div className={styles.synthTableBody}>
                {availableSynths
                  .filter(synth => synth.category === 'forex')
                  .map(synth => {
                    return (
                      <div className={styles.synthWrapper}>
                        <img src={`/images/synths/${synth.name}-icon.svg`} />
                        <span>{synth.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    availableSynths: getAvailableSynths(state),
    synthToExchange: getSynthToExchange(state),
  };
};

const mapDispatchToProps = {
  setSynthToExchange,
};

SynthPicker.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthToExchange: PropTypes.object,
  setSynthToExchange: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SynthPicker);
