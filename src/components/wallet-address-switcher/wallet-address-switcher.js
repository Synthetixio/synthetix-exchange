import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getCurrentWalletInfo } from '../../ducks';

import styles from './wallet-address-switcher.module.scss';

class WalletAddressSwitcher extends Component {
  render() {
    const { currentWalletInfo } = this.props;
    const walletSelected =
      currentWalletInfo && currentWalletInfo.selectedWallet
        ? currentWalletInfo.selectedWallet
        : 'no wallet connected';
    return <div>{walletSelected}</div>;
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
