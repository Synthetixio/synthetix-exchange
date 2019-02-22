import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numbro from 'numbro';

import { getAvailableSynths } from '../../ducks/';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import { setSynthToBuy } from '../../ducks/synths';
import {
  getSynthToExchange,
  getSynthToBuy,
  getExchangeRates,
} from '../../ducks';

import { SYNTH_SIGNS } from '../../synthsList';
import styles from './rate-list.module.scss';

class RateList extends Component {
  constructor() {
    super();
    this.selectSynthToBuy = this.selectSynthToBuy.bind(this);
  }

  selectSynthToBuy(currency) {
    return () => {
      const { setSynthToBuy, synthToBuy } = this.props;
      if (currency === synthToBuy) return;
      setSynthToBuy(currency);
    };
  }

  async componentDidMount() {
    if (!synthetixJsTools.initialized) return;
    const { availableSynths } = this.props;
    const ratesObject = {};
    try {
      const ratesForCurrencies = await synthetixJsTools.synthetixJs.ExchangeRates.ratesForCurrencies(
        availableSynths.map(synth => synthetixJsTools.utils.toUtf8Bytes(synth))
      );
      availableSynths.forEach((synth, i) => {
        ratesObject[synth] = formatBigNumber(ratesForCurrencies[i], 6);
      });
    } catch (e) {
      console.log('Unable to fetch latest rates', e);
    }
    this.setState({ rates: ratesObject });
  }

  renderTableBody() {
    const { exchangeRates, synthToExchange, synthToBuy } = this.props;
    if (!exchangeRates) return;
    const rates = exchangeRates[synthToExchange].filter(synth => {
      return synth.synth !== synthToExchange;
    });

    return rates.map((synth, i) => {
      // Small fix to avoid price like 0.0000 when sKRW/sJPY against sXAU
      const precision =
        synth.synth === 'sXAU' &&
        (synthToExchange === 'sKRW' || synthToExchange === 'sJPY')
          ? '0,0.00000000'
          : '0,0.00000';
      return (
        <tr
          key={i}
          className={
            synthToBuy && synthToBuy === synth.synth
              ? styles.tableRowActive
              : ''
          }
          onClick={this.selectSynthToBuy(synth.synth)}
        >
          <td className={styles.tableBodySynth}>
            <img
              src={`images/synths/${synth.synth}-icon.svg`}
              alt="synth icon"
            />
            <span>{synth.synth}</span>
          </td>
          <td />
          <td className={styles.rate}>
            {SYNTH_SIGNS[synth.synth]}
            {numbro(synth.rate).format(precision)}
          </td>
          <td />
        </tr>
      );
    });
  }

  render() {
    return (
      <div className={styles.rateList}>
        <table cellSpacing="0" className={styles.rateListTable}>
          <thead>
            <tr>
              <th>
                <h2>Current Rates</h2>
              </th>
              <th>{/* <h3>Low</h3> */}</th>
              <th className={styles.rate}>
                <h3>Rate</h3>
              </th>
              <th>{/* <h3>High</h3> */}</th>
            </tr>
          </thead>
          <tbody>{this.renderTableBody()}</tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    availableSynths: getAvailableSynths(state),
    synthToExchange: getSynthToExchange(state),
    synthToBuy: getSynthToBuy(state),
    exchangeRates: getExchangeRates(state),
  };
};

const mapDispatchToProps = {
  setSynthToBuy,
};

RateList.propTypes = {
  availableSynths: PropTypes.array.isRequired,
  synthToExchange: PropTypes.string,
  synthToBuy: PropTypes.string,
  setSynthToBuy: PropTypes.func.isRequired,
  exchangeRates: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RateList);
