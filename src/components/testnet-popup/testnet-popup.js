import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Popup from '../popup';

import { toggleTestnetPopup } from '../../ducks/ui';

import styles from './testnet-popup.module.scss';

class WalletSelectorPopup extends Component {
  constructor() {
    super();
    this.closePopup = this.closePopup.bind(this);
  }

  closePopup() {
    const { toggleTestnetPopup } = this.props;
    toggleTestnetPopup(false);
  }

  render() {
    const { isVisible } = this.props;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div className={styles.testnetPopup}>
          <h1>This is Demo Mode for testing</h1>
          <h2>TESTNET mode</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <span className={styles.stepNumber}>1.</span>To get started with
              Synthetix Exchange on Testnet first get some ETH from{' '}
              <a
                href="https://github.com/kovan-testnet/"
                target="_blank"
                rel="noopener noreferrer"
              >
                KOVAN faucet.
              </a>
            </div>
            <div className={styles.step}>
              <span className={styles.stepNumber}>2.</span>Then swap part of
              your ETH for SNX on{' '}
              <a
                href="https://swappr.io"
                target="_blank"
                rel="noopener noreferrer"
              >
                Swappr.
              </a>
            </div>
          </div>
        </div>
      </Popup>
    );
  }
}

const mapDispatchToProps = {
  toggleTestnetPopup,
};

WalletSelectorPopup.propTypes = {
  toggleTestnetPopup: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(WalletSelectorPopup);
