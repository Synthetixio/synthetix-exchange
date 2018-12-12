import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Exchange from '../exchange';
import ConnectToWallet from '../connect-to-wallet';

import { getCurrentScreen } from '../../ducks/';

import styles from './root.module.scss';

class Root extends Component {
  renderScreen() {
    const { currentScreen } = this.props;
    switch (currentScreen) {
      case 'exchange':
        return <Exchange />;
      case 'connectToWallet':
        return <ConnectToWallet />;
      default:
        return <Exchange />;
    }
  }
  render() {
    return <div className={styles.root}>{this.renderScreen()}</div>;
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
