import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setTransactionSpeed } from '../../ducks/wallet';
import { getTransactionSettings } from '../../ducks/';

import styles from './gwei-selector.module.scss';

class GweiSelector extends Component {
  onSpeedChange(speed) {
    return () => {
      const { setTransactionSpeed } = this.props;
      setTransactionSpeed(speed);
    };
  }

  render() {
    const { transactionSettings } = this.props;
    const { transactionSpeed, gasAndSpeedInfo } = transactionSettings;
    const gasPriceLimit = gasAndSpeedInfo && gasAndSpeedInfo.gasPriceLimit;
    return (
      <div className={styles.gweiSelectorWrapper}>
        <div className={styles.gweiSelectorHeading}>
          Select transaction speed{' '}
          {gasPriceLimit ? `(gas price limit: ${gasPriceLimit} gwei)` : null}
        </div>
        <div className={styles.gweiSelectorRow}>
          {['slow', 'average', 'fast'].map((speed, i) => {
            return (
              <div
                key={i}
                onClick={this.onSpeedChange(speed)}
                className={`${styles.gweiSelector} ${
                  transactionSpeed === speed ? styles.selected : ''
                }`}
              >
                {speed}
                <div className={styles.gweiSelectorPrice}>
                  ${gasAndSpeedInfo ? gasAndSpeedInfo[speed].price : 0}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    transactionSettings: getTransactionSettings(state),
  };
};

const mapDispatchToProps = {
  setTransactionSpeed,
};

GweiSelector.propTypes = {
  transactionSettings: PropTypes.object.isRequired,
  setTransactionSpeed: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GweiSelector);
