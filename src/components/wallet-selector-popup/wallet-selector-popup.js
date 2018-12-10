import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Popup from '../popup';

import { toggleWalletSelectorPopup, changeScreen } from '../../ducks/ui';

import { connectWallet } from '../../ducks/wallet';

import styles from './wallet-selector-popup.module.scss';

const walletTypes = ['MetaMask', 'Trezor', 'Ledger'];

class WalletSelectorPopup extends Component {
  constructor() {
    super();
    this.closePopup = this.closePopup.bind(this);
    this.goToWalletConnector = this.goToWalletConnector.bind(this);
  }

  closePopup() {
    const { toggleWalletSelectorPopup } = this.props;
    toggleWalletSelectorPopup(false);
  }

  goToWalletConnector(walletType) {
    const { changeScreen, connectWallet } = this.props;
    return () => {
      connectWallet(walletType);
      changeScreen('walletConnector');
    };
  }

  render() {
    const { isVisible } = this.props;
    return (
      <Popup isVisible={isVisible} closePopup={this.closePopup}>
        <div>
          <h1>Connect a Wallet</h1>
          <div className={styles.buttonsWrapper}>
            {walletTypes.map(wallet => {
              return (
                <button
                  onClick={this.goToWalletConnector(wallet)}
                  key={wallet}
                  className={styles.button}
                >
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

const mapDispatchToProps = {
  toggleWalletSelectorPopup,
  changeScreen,
  connectWallet,
};

WalletSelectorPopup.propTypes = {
  toggleWalletSelectorPopup: PropTypes.func.isRequired,
  changeScreen: PropTypes.func.isRequired,
  connectWallet: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(WalletSelectorPopup);
