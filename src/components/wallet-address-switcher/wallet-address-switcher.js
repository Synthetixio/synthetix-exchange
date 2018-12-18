import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentWalletInfo } from '../../ducks';

import styles from './wallet-address-switcher.module.scss';

class WalletAddressSwitcher extends Component {
  constructor() {
    super();
    this.state = {
      dropdownIsOpen: false,
    };
    this.toggleDropdown = this.toggleDropdown.bind(this);
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

  renderDropdown() {
    const { dropdownIsOpen } = this.state;
    if (!dropdownIsOpen) return;
    const { currentWalletInfo } = this.props;
    const { availableWallets } = currentWalletInfo;
    return (
      <div className={styles.addressDropdown}>
        {availableWallets.map(wallet => {
          return <div className={styles.addressDropdownElement}>{wallet}</div>;
        })}
      </div>
    );
  }

  render() {
    const { currentWalletInfo } = this.props;
    const { dropdownIsOpen } = this.state;
    const { selectedWallet, availableWallets } = currentWalletInfo;

    return (
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
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
  };
};

const mapDispatchToProps = {};

WalletAddressSwitcher.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WalletAddressSwitcher);
