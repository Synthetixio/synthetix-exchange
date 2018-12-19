import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner';
import numbro from 'numbro';
import styles from './wallet-selector-balance.module.scss';

class WalletSelectorWithBalances extends Component {
  state = {
    isOpen: false,
  };

  renderTableContent() {
    const {
      availableWallets,
      walletPageSize,
      walletSelectorIndex,
      onSelectWallet,
    } = this.props;

    return availableWallets
      .slice(walletSelectorIndex, walletSelectorIndex + walletPageSize)
      .map((wallet, index) => {
        return (
          <tr key={index} onClick={onSelectWallet(index)}>
            <td>{wallet.address}</td>
            <td>
              {wallet.balances[0] && wallet.balances[1]
                ? numbro(
                    Number(wallet.balances[0]) + Number(wallet.balances[1])
                  ).format('0,0.00')
                : '0'}
            </td>
            <td>
              {' '}
              {wallet.balances[2]
                ? numbro(wallet.balances[2]).format('0,0.00')
                : 0}
            </td>
            <td>
              {wallet.balances[3]
                ? numbro(wallet.balances[3]).format('0,0.000000')
                : 0}
            </td>
          </tr>
        );
      });
  }

  renderPager() {
    const { onNextPage, onPrevPage, showSpinner } = this.props;
    return (
      <div className={styles.pagerRow}>
        <svg
          className={styles.pagerRowIcon}
          width="40"
          height="40"
          viewBox="0 0 1792 1792"
          onClick={onPrevPage}
        >
          <path d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z" />
        </svg>

        {showSpinner && (
          <div className="spinner">
            <Spinner small={true} />
          </div>
        )}
        <svg
          className={styles.pagerRowIcon}
          width="40"
          height="40"
          viewBox="0 0 1792 1792"
          onClick={onNextPage}
        >
          <path d="M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z" />
        </svg>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className={styles.walletSelectorHeader}>
          <h1>Select Wallet</h1>
          <h2>Please select the wallet you would like to use</h2>
        </div>
        <table cellSpacing="0" cellPadding="0" className={styles.balanceTable}>
          <thead>
            <tr>
              <th>Address</th>
              <th>SNX Balance</th>
              <th>sUSD Balance</th>
              <th>ETH Balance</th>
            </tr>
          </thead>
          <tbody>{this.renderTableContent()}</tbody>
        </table>
        {this.renderPager()}
      </div>
    );
  }
}

WalletSelectorWithBalances.propTypes = {
  availableWallets: PropTypes.array.isRequired,
  walletPageSize: PropTypes.number.isRequired,
  walletSelectorIndex: PropTypes.number.isRequired,
  onSelectWallet: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  onPrevPage: PropTypes.func.isRequired,
  showSpinner: PropTypes.bool.isRequired,
};

export default WalletSelectorWithBalances;
