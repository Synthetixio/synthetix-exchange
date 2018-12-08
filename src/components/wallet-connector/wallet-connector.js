import React, { Component } from 'react';
import styles from './wallet-connector.module.scss';

class WalletConnector extends Component {
  constructor() {
    super();
    this.connectWallet = this.connectWallet.bind(this);
  }

  connectWallet() {
    console.log('CONNECT WALLET');
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

export default WalletConnector;
