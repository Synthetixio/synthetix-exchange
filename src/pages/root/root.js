import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Exchange from '../exchange';
import ConnectToWallet from '../connect-to-wallet';

import { getCurrentScreen, getAvailableSynths } from '../../ducks/';
import { updateExchangeRates } from '../../ducks/synths';

import synthetixJsTools from '../../synthetixJsTool';

import styles from './root.module.scss';

class Root extends Component {
  constructor() {
    super();
    this.updatePrices = this.updatePrices.bind(this);
  }

  async updatePrices() {
    const { availableSynths, updateExchangeRates } = this.props;
    if (!availableSynths) return;
    let rateObject = {};
    const rates = await synthetixJsTools.havvenJs.ExchangeRates.ratesForCurrencies(
      availableSynths.map(synth => synthetixJsTools.utils.toUtf8Bytes(synth))
    );
    rates.forEach((rate, i) => {
      rateObject[availableSynths[i]] = Number(
        synthetixJsTools.havvenJs.utils.formatEther(rate)
      );
    });
    updateExchangeRates(rateObject);
  }

  componentDidMount() {
    this.updatePrices();
    setInterval(this.updatePrices, 60 * 1000);
  }

  componentWillMount() {
    synthetixJsTools.setContractSettings();
  }

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
    availableSynths: getAvailableSynths(state),
  };
};

const mapDispatchToProps = {
  updateExchangeRates,
};

Root.propTypes = {
  currentScreen: PropTypes.string.isRequired,
  availableSynths: PropTypes.array.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
