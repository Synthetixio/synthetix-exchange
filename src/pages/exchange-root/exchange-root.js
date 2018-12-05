import React, { Component } from 'react';
import { connect } from 'react-redux';
import Exchange from '../exchange';
import WalletConnector from '../wallet-connector';
import WalletSelector from '../wallet-selector';
import { changeScreen } from '../../ducks/ui';
import { getCurrentScreen } from '../../ducks';
import PropTypes from 'prop-types';

const SCREENS = {
  walletConnector: WalletConnector,
  walletSelector: WalletSelector,
  exchange: Exchange,
};

class ExchangeRoot extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.changeScreen('walletSelector');
  }

  render() {
    const { currentScreen } = this.props;
    const ActiveScreen = SCREENS[currentScreen];
    return (
      <div>
        <ActiveScreen />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentScreen: getCurrentScreen(state),
  };
};

const mapDispatchToProps = {
  changeScreen,
};

ExchangeRoot.propTypes = {
  changeScreen: PropTypes.func.isRequired,
  currentScreen: PropTypes.string.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExchangeRoot);
