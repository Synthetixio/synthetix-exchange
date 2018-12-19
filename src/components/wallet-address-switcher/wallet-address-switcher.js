import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import OutsideClickHandler from 'react-outside-click-handler';
import Spinner from '../spinner';

import { getCurrentWalletInfo } from '../../ducks';
import { connectToWallet } from '../../ducks/wallet';

import synthetixJsTools from '../../synthetixJsTool';

import styles from './wallet-address-switcher.module.scss';

class WalletAddressSwitcher extends Component {
  constructor() {
    super();
    this.state = {
      dropdownIsOpen: false,
      fetchingNextAddresses: false,
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.onSelectWallet = this.onSelectWallet.bind(this);
    this.onNextPage = this.onNextPage.bind(this);
    this.onPrevPage = this.onPrevPage.bind(this);
  }

  toggleDropdown() {
    const { currentWalletInfo } = this.props;
    const { availableWallets } = currentWalletInfo;
    if (!availableWallets || availableWallets.lenght <= 1) return;
    this.setState({ dropdownIsOpen: !this.state.dropdownIsOpen });
  }

  shortenAddress(address) {
    if (!address) return null;
    return (
      <div className={styles.addressSwitcherWallet}>
        {address.slice(0, 6) + '...' + address.slice(-4, address.length)}
      </div>
    );
  }

  onSelectWallet(index) {
    return () => {
      const { currentWalletInfo, connectToWallet } = this.props;
      const walletAddress =
        currentWalletInfo.availableWallets[
          currentWalletInfo.walletSelectorIndex + index
        ];
      if (!walletAddress) return;
      synthetixJsTools.signer.setAddressIndex(index);
      connectToWallet({
        selectedWallet: walletAddress,
      });
    };
  }

  async getNextAddresses(availableWallets, selectorIndex, pageSize) {
    const { connectToWallet } = this.props;
    let wallets = availableWallets.slice();
    if (!synthetixJsTools.signer.getNextAddresses) return;
    let nextAddresses = await synthetixJsTools.signer.getNextAddresses(
      availableWallets.length,
      pageSize
    );
    wallets.push(...nextAddresses);
    connectToWallet({
      availableWallets: wallets,
      walletSelectorIndex: selectorIndex + pageSize,
    });
  }

  async onNextPage() {
    const { currentWalletInfo, connectToWallet } = this.props;
    const {
      walletSelectorIndex,
      availableWallets,
      walletPageSize,
    } = currentWalletInfo;
    if (walletSelectorIndex + walletPageSize >= availableWallets.length) {
      await this.setState({ fetchingNextAddresses: true });
      await this.getNextAddresses(
        availableWallets,
        walletSelectorIndex,
        walletPageSize
      );
      this.setState({ fetchingNextAddresses: false });
    } else {
      connectToWallet({
        walletSelectorIndex: walletSelectorIndex + walletPageSize,
      });
    }
  }

  async onPrevPage() {
    const { currentWalletInfo, connectToWallet } = this.props;
    const { walletSelectorIndex, walletPageSize } = currentWalletInfo;
    let index = walletSelectorIndex - walletPageSize;
    if (index < 0) index = 0;
    connectToWallet({ walletSelectorIndex: index });
  }

  renderDropdown() {
    const { dropdownIsOpen, fetchingNextAddresses } = this.state;
    if (!dropdownIsOpen) return;
    const { currentWalletInfo } = this.props;
    const {
      availableWallets,
      walletSelectorIndex,
      walletPageSize,
    } = currentWalletInfo;
    return (
      <div className={styles.addressDropdown}>
        <div className={styles.addressDropdownBody}>
          {availableWallets
            .slice(walletSelectorIndex, walletSelectorIndex + walletPageSize)
            .map((wallet, index) => {
              return (
                <div
                  key={index}
                  className={styles.addressDropdownElement}
                  onClick={this.onSelectWallet(index)}
                >
                  {wallet}
                </div>
              );
            })}
        </div>
        <div className={styles.addressDropdownFooter}>
          <svg
            className={styles.addressDropdownFooterIcon}
            width="20"
            height="20"
            viewBox="0 0 1792 1792"
            onClick={this.onPrevPage}
          >
            <path d="M1203 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z" />
          </svg>
          {fetchingNextAddresses ? <Spinner small={true} /> : null}
          <svg
            className={styles.addressDropdownFooterIcon}
            width="20"
            height="20"
            viewBox="0 0 1792 1792"
            onClick={this.onNextPage}
          >
            <path d="M1171 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z" />
          </svg>
        </div>
      </div>
    );
  }

  render() {
    const { currentWalletInfo } = this.props;
    const { dropdownIsOpen } = this.state;
    const { selectedWallet, availableWallets } = currentWalletInfo;

    return (
      <OutsideClickHandler
        onOutsideClick={() => this.setState({ dropdownIsOpen: false })}
      >
        <div className={styles.addressSwitcherWrapper}>
          <div
            onClick={this.toggleDropdown}
            className={`${styles.addressSwitcher} ${
              selectedWallet ? styles.addressSwitcherIsConnected : ''
            } ${
              availableWallets && availableWallets.length > 1
                ? styles.addressSwitcherIsCollapsable
                : ''
            }
          ${dropdownIsOpen ? styles.addressSwitcherIsCollapsed : ''}`}
          >
            <span className={styles.addressSwitcherStatus}>
              {selectedWallet ? 'Connected' : 'Wallet not connected'}
            </span>
            {this.shortenAddress(selectedWallet)}
          </div>
          {this.renderDropdown()}
        </div>
      </OutsideClickHandler>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
  };
};

const mapDispatchToProps = {
  connectToWallet,
};

WalletAddressSwitcher.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  connectToWallet: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletAddressSwitcher);
