import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { walletSelectorPopupIsVisible } from '../../ducks/';
import { toggleWalletSelectorPopup } from '../../ducks/ui';

import styles from './wallet-connector.module.scss';

const WALLETS = ['metamask', 'trezor', 'ledger'];

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
        <div className={styles.walletConnectorInner}>
          <h2>Connect a Wallet to Trade</h2>
          <div className={styles.walletLogos}>
            {WALLETS.map(wallet => (
              <img
                key={wallet}
                alt="wallet icon"
                src={`/images/wallets/${wallet}.svg`}
              />
            ))}
          </div>
        </div>
        <button
          className={styles.walletConnectorButton}
          onClick={this.connectWallet}
        >
          Connect Wallet
        </button>
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
