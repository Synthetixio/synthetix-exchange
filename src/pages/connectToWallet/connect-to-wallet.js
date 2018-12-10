import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Spinner from '../../components/spinner';

import { getCurrentWalletType } from '../../ducks/';

import styles from './connect-to-wallet.module.scss';

class ConnectToWallet extends Component {
  render() {
    const { currentWalletType } = this.props;
    return (
      <div className={styles.connectToWallet}>
        <h1>Convert via {currentWalletType}</h1>
        <Spinner />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletType: getCurrentWalletType(state),
  };
};

const mapDispatchToProps = {};

ConnectToWallet.propTypes = {
  currentWalletType: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ConnectToWallet);
