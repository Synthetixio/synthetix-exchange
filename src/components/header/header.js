import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getCurrentWalletInfo,
  testnetPopupIsVisible,
  getCurrentScreen,
  getCurrentExchangeMode,
  walletSelectorPopupIsVisible,
} from '../../ducks/';
import {
  toggleTestnetPopup,
  toggleFeedbackPopup,
  toggleWalkthroughPopup,
  changeScreen,
  changeExchangeMode,
  toggleWalletSelectorPopup,
} from '../../ducks/ui';

import WalletAddressSwitcher from '../wallet-address-switcher';
import styles from './header.module.scss';

class Header extends Component {
  constructor() {
    super();
    this.onEnvButtonClick = this.onEnvButtonClick.bind(this);
    this.onFeedbackButtonClick = this.onFeedbackButtonClick.bind(this);
    this.onWalkthroughButtonClick = this.onWalkthroughButtonClick.bind(this);
    this.onPageButtonClick = this.onPageButtonClick.bind(this);
    this.connectWallet = this.connectWallet.bind(this);
    this.switchExchangeMode = this.switchExchangeMode.bind(this);
  }

  onEnvButtonClick() {
    const {
      toggleTestnetPopup,
      testnetPopupIsVisible,
      currentWalletInfo,
    } = this.props;
    if (!currentWalletInfo.networkId || currentWalletInfo.networkId === '1')
      return;
    toggleTestnetPopup(!testnetPopupIsVisible);
  }

  onFeedbackButtonClick() {
    const { toggleFeedbackPopup } = this.props;
    toggleFeedbackPopup(true);
  }

  onWalkthroughButtonClick() {
    const { toggleWalkthroughPopup } = this.props;
    toggleWalkthroughPopup(true);
  }

  onPageButtonClick() {
    const { changeScreen, currentScreen } = this.props;
    const nextScreen =
      currentScreen === 'exchange' ? 'transactions' : 'exchange';
    changeScreen(nextScreen);
  }

  connectWallet() {
    const {
      toggleWalletSelectorPopup,
      walletSelectorPopupIsVisible,
    } = this.props;
    toggleWalletSelectorPopup(!walletSelectorPopupIsVisible);
  }

  renderNetworkName() {
    const { currentWalletInfo } = this.props;
    switch (currentWalletInfo.networkId) {
      case '1':
        return 'MAINNET';
      case '3':
        return 'ROPSTEN';
      case '42':
        return 'KOVAN';
      default:
        return 'MAINNET';
    }
  }

  switchExchangeMode() {
    const { currentExchangeMode, changeExchangeMode } = this.props;
    const newMode = currentExchangeMode === 'basic' ? 'pro' : 'basic';
    changeExchangeMode(newMode);
  }

  render() {
    const { currentWalletInfo, currentExchangeMode } = this.props;
    const { selectedWallet } = currentWalletInfo;
    return (
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <img height="36" alt="logo" src="/images/synthetix-logo.svg" />
          <button
            type="button"
            onClick={this.onEnvButtonClick}
            className={styles.envButton}
          >
            {this.renderNetworkName()}
          </button>
          <button
            onClick={this.switchExchangeMode}
            className={styles.headerButton}
          >{`${
            currentExchangeMode === 'basic' ? 'Pro' : 'Basic'
          } Mode`}</button>
        </div>
        <div className={styles.headerRightArea}>
          <button className={styles.headerButton}>Markets</button>
          <button className={styles.headerButton}>Transactions</button>
          {selectedWallet ? (
            <WalletAddressSwitcher />
          ) : (
            <button
              className={styles.walletConnectorButton}
              onClick={this.connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    testnetPopupIsVisible: testnetPopupIsVisible(state),
    currentScreen: getCurrentScreen(state),
    currentExchangeMode: getCurrentExchangeMode(state),
    walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state),
  };
};

const mapDispatchToProps = {
  toggleTestnetPopup,
  toggleFeedbackPopup,
  toggleWalkthroughPopup,
  toggleWalletSelectorPopup,
  changeScreen,
  changeExchangeMode,
};

Header.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  testnetPopupIsVisible: PropTypes.bool.isRequired,
  toggleTestnetPopup: PropTypes.func.isRequired,
  toggleFeedbackPopup: PropTypes.func.isRequired,
  toggleWalkthroughPopup: PropTypes.func.isRequired,
  changeScreen: PropTypes.func.isRequired,
  changeExchangeMode: PropTypes.func.isRequired,
  currentScreen: PropTypes.string.isRequired,
  currentExchangeMode: PropTypes.string.isRequired,
  walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
  toggleWalletSelectorPopup: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
