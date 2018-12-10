import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { walletSelectorPopupIsVisible } from '../../ducks/';
import { toggleWalletSelectorPopup } from '../../ducks/ui';

import styles from './wallet-connector.module.scss';

class WalletConnector extends Component {
  constructor() {
    super();
    this.connectWallet = this.connectWallet.bind(this);
  }

  connectWallet() {
    const {
      toggleWalletSelectorPopup,
      walletSelectorPopupIsVisible,
    } = this.props;
    toggleWalletSelectorPopup(!walletSelectorPopupIsVisible);
  }

  render() {
    return (
      <div className={styles.walletConnector}>
        <h2>Connect a wallet to trade</h2>
        <div className={styles.walletLogos}>
          <div>MetaMask</div>
          <div>Trezor</div>
          <div>Ledger</div>
        </div>
        <button onClick={this.connectWallet}>Connect Wallet</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state) };
};

const mapDispatchToProps = { toggleWalletSelectorPopup };

WalletConnector.propTypes = {
  walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
  toggleWalletSelectorPopup: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletConnector);
