import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCurrentWalletInfo, testnetPopupIsVisible } from '../../ducks/';
import { toggleTestnetPopup } from '../../ducks/ui';

import WalletAddressSwitcher from '../wallet-address-switcher';
import styles from './header.module.scss';

class Header extends Component {
  constructor() {
    super();
    this.onEnvButtonClick = this.onEnvButtonClick.bind(this);
  }

  onEnvButtonClick() {
    const {
      toggleTestnetPopup,
      testnetPopupIsVisible,
      currentWalletInfo,
    } = this.props;
    if (!currentWalletInfo.networkId || currentWalletInfo.networkId !== '42')
      return;
    toggleTestnetPopup(!testnetPopupIsVisible);
  }

  renderNetworkName() {
    const { currentWalletInfo } = this.props;
    switch (currentWalletInfo.networkId) {
      case '1':
        return 'MAINNET';
      case '42':
        return 'KOVAN';
      default:
        return 'MAINNET';
    }
  }

  render() {
    return (
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <img height="36" alt="logo" src="/images/synthetix-logo.svg" />
          <span className={styles.beta}>[beta]</span>
          <button
            type="button"
            onClick={this.onEnvButtonClick}
            className={styles.envButton}
          >
            {this.renderNetworkName()}
          </button>
        </div>
        <WalletAddressSwitcher />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    testnetPopupIsVisible: testnetPopupIsVisible(state),
  };
};

const mapDispatchToProps = {
  toggleTestnetPopup,
};

Header.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  testnetPopupIsVisible: PropTypes.bool.isRequired,
  toggleTestnetPopup: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
