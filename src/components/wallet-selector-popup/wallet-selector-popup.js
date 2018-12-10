import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Popup from '../popup';

import { toggleWalletSelectorPopup } from '../../ducks/ui';

import styles from './wallet-selector-popup.module.scss';

const walletTypes = ['MetaMask', 'Trezor', 'Ledger'];

class WalletSelectorPopup extends Component {
  constructor() {
    super();
    this.closePopup = this.closePopup.bind(this);
  }

  closePopup() {
    const { toggleWalletSelectorPopup } = this.props;
    toggleWalletSelectorPopup(false);
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

const mapDispatchToProps = {
  toggleWalletSelectorPopup,
};

WalletSelectorPopup.propTypes = {
  toggleWalletSelectorPopup: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps
)(WalletSelectorPopup);
