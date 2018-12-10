import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Exchange from '../exchange';
import WalletConnector from '../connectToWallet';

import { getCurrentScreen } from '../../ducks/';

import styles from './root.module.scss';

class Root extends Component {
  render() {
    const { currentScreen } = this.props;
    return (
      <div className={styles.root}>
        {currentScreen === 'exchange' ? <Exchange /> : <WalletConnector />}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentScreen: getCurrentScreen(state),
  };
};

Root.propTypes = {
  currentScreen: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  null
)(Root);
