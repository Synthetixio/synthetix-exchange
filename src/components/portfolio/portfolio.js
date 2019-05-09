import React, { Component } from 'react';
import { connect } from 'react-redux';

import synthetixJsTools from '../../synthetixJsTool';

import PropTypes from 'prop-types';
// import numbro from 'numbro';

import { getCurrentWalletInfo, getAvailableSynths } from '../../ducks/';

import { Chart } from 'frappe-charts/dist/frappe-charts.esm.js';
import 'frappe-charts/dist/frappe-charts.min.css';
// import styles from './rate-list.module.scss';

class Portfolio extends Component {
  constructor() {
    super();
  }

  renderPorfolioChart() {
    const { currentWalletInfo, synthBalances } = this.props;
    const { initialized } = synthetixJsTools;
    if (!initialized || !currentWalletInfo || !currentWalletInfo.selectedWallet)
      return <div>---</div>;

    const balances = synthBalances
      .filter(({ balance }) => Number(balance) > 0)
      .sort((a, b) =>
        Number(a.balanceInUSD) > Number(b.balanceInUSD) ? -1 : 1
      );

    const { chartTarget } = this;
    const ChartRender = () => {
      let data = {
        labels: balances.map(({ name }) => name),
        datasets: [
          {
            values: balances.map(({ balanceInUSD }) =>
              Number(Number(balanceInUSD).toFixed(6))
            ),
          },
        ],
      };

      new Chart(chartTarget, {
        data,
        type: 'percentage',
      });
      return null;
    };

    return <ChartRender />;
  }

  render() {
    return (
      <div>
        <div ref={target => (this.chartTarget = target)} />
        {this.renderPorfolioChart()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    availableSynths: getAvailableSynths(state),
    // synthToExchange: getSynthToExchange(state),
    // synthToBuy: getSynthToBuy(state),
    // exchangeRates: getExchangeRates(state),
  };
};

const mapDispatchToProps = {
  // setSynthToBuy,
};

Portfolio.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthBalances: PropTypes.array.isRequired,

  // synthToExchange: PropTypes.object,
  // synthToBuy: PropTypes.object,
  // setSynthToBuy: PropTypes.func.isRequired,
  // exchangeRates: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Portfolio);
