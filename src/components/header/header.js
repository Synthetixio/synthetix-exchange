import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCurrentWalletInfo, testnetPopupIsVisible } from '../../ducks/';
import { toggleTestnetPopup, toggleFeedbackPopup } from '../../ducks/ui';

import WalletAddressSwitcher from '../wallet-address-switcher';
import styles from './header.module.scss';

class Header extends Component {
  constructor() {
    super();
    this.onEnvButtonClick = this.onEnvButtonClick.bind(this);
    this.onFeedbackButtonClick = this.onFeedbackButtonClick.bind(this);
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
            onClick={this.onFeedbackButtonClick}
            className={styles.headerButton}
          >
            Got feedback?
          </button>
          <WalletAddressSwitcher />
        </div>
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
  toggleFeedbackPopup,
};

Header.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  testnetPopupIsVisible: PropTypes.bool.isRequired,
  toggleTestnetPopup: PropTypes.func.isRequired,
  toggleFeedbackPopup: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
