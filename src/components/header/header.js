import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  getCurrentWalletInfo,
  testnetPopupIsVisible,
  getCurrentScreen,
  walletSelectorPopupIsVisible,
} from '../../ducks/';
import {
  toggleTestnetPopup,
  toggleFeedbackPopup,
  toggleWalkthroughPopup,
  changeScreen,
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

  render() {
    const { currentScreen, currentWalletInfo } = this.props;
    const { selectedWallet } = currentWalletInfo;
    return (
      <div className={styles.header}>
        <div className={styles.logoWrapper}>
          <img height="36" alt="logo" src="/images/synthetix-logo.svg" />
          <button
            type="button"
            onClick={this.onEnvButtonClick}
            className={`${styles.headerButton} ${styles.envButton}`}
          >
            {this.renderNetworkName()}
          </button>
        </div>
        <div className={styles.headerRightArea}>
          <button
            type="button"
            onClick={this.onWalkthroughButtonClick}
            className={styles.headerButton}
          >
            <span>Walkthrough</span>
            <img
              className={styles.headerButtonIcon}
              width="20"
              src="images/play-icon.svg"
            />
          </button>
          <button
            type="button"
            onClick={this.onFeedbackButtonClick}
            className={styles.headerButton}
          >
            Got feedback?
          </button>
          <button
            type="button"
            onClick={this.onPageButtonClick}
            className={styles.headerButton}
          >
            {currentScreen === 'exchange' ? 'Trading History' : 'Exchange'}
          </button>
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
    walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state),
  };
};

const mapDispatchToProps = {
  toggleTestnetPopup,
  toggleFeedbackPopup,
  toggleWalkthroughPopup,
  toggleWalletSelectorPopup,
  changeScreen,
};

Header.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  testnetPopupIsVisible: PropTypes.bool.isRequired,
  toggleTestnetPopup: PropTypes.func.isRequired,
  toggleFeedbackPopup: PropTypes.func.isRequired,
  toggleWalkthroughPopup: PropTypes.func.isRequired,
  changeScreen: PropTypes.func.isRequired,
  currentScreen: PropTypes.string.isRequired,
  walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
  toggleWalletSelectorPopup: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
