import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getCurrentWalletInfo } from '../../ducks/';

import WalletAddressSwitcher from '../wallet-address-switcher';
import styles from './header.module.scss';

class Header extends Component {
  constructor() {
    super();
  }

  onEnvButtonClick() {
    console.log('yo');
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
            Mainnet
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
  };
};

const mapDispatchToProps = {};

Header.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
