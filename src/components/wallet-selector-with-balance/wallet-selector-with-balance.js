import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner';
import numeral from 'numeral';
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
              {numeral(
                Number(wallet.balances[0]) + Number(wallet.balances[1])
              ).format('0,0.00')}
            </td>
            <td> {numeral(wallet.balances[2]).format('0,0.00')}</td>
            <td>{numeral(wallet.balances[3]).format('0,0.000000')}</td>
          </tr>
        );
      });
  }

  renderPager() {
    const { onNextPage, onPrevPage, showSpinner } = this.props;
    return (
      <div className={styles.pagerRow}>
        <div onClick={onPrevPage}>
          <svg width="15px" height="27px" viewBox="0 0 10 18" version="1.1">
            <g stroke="none" fill="none">
              <g transform="translate(-719.000000, -714.000000)" fill="#25244B">
                <g transform="translate(697.000000, 511.000000)">
                  <g transform="translate(0.000000, 188.000000)">
                    <path
                      d="M24.2994063,32.41 L22.7814063,31.108 L28.8744063,24 L22.7814063,16.892 L24.2994063,15.59 L30.9504063,23.35 C31.2714063,23.724 31.2714063,24.277 30.9504063,24.651 L24.2994063,32.41 Z"
                      transform="translate(26.986281, 24.000000) rotate(-180.000000) translate(-26.986281, -24.000000) "
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
        {showSpinner && (
          <div className="spinner">
            <Spinner small={true} />
          </div>
        )}
        <div onClick={onNextPage}>
          <svg width="15px" height="27px" viewBox="0 0 10 18" version="1.1">
            <g stroke="none" fill="none">
              <g
                transform="translate(-1095.000000, -714.000000)"
                fill="#25244B"
              >
                <g transform="translate(697.000000, 511.000000)">
                  <g transform="translate(0.000000, 188.000000)">
                    <path d="M400.108,32.41 L398.59,31.108 L404.683,24 L398.59,16.892 L400.108,15.59 L406.759,23.35 C407.08,23.724 407.08,24.277 406.759,24.651 L400.108,32.41 Z" />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div>
          <h1>Select Wallet</h1>
          <h2>Please select the wallet you would like to use</h2>
        </div>
        <table className={styles.balanceTable}>
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
