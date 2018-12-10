import React, { Component } from 'react';
import Popup from '../popup';
import styles from './wallet-selector-popup.module.scss';
import PropTypes from 'prop-types';

const walletTypes = ['MetaMask', 'Trezor', 'Ledger'];

class WalletSelectorPopup extends Component {
  render() {
    const { isVisible } = this.props;
    return (
      <Popup isVisible={isVisible}>
        <div>
          <h1>Connect a Wallet</h1>
          <div className={styles.buttonsWrapper}>
            {walletTypes.map(wallet => {
              return (
                <button key={wallet} className={styles.button}>
                  {wallet}
                </button>
              );
            })}
          </div>
        </div>
      </Popup>
    );
  }
}

WalletSelectorPopup.propTypes = {
  isVisible: PropTypes.bool.isRequired,
};

export default WalletSelectorPopup;
