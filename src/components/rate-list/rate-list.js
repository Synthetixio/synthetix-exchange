import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import { getAvailableSynths } from '../../ducks/';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import styles from './rate-list.module.scss';
import { changeScreen } from '../../ducks/ui';
import { setSynthToBuy } from '../../ducks/synths';

class RateList extends Component {
  constructor() {
    super();
    this.state = {
      rates: null,
    };
  }
  buyCurrency(currency) {
    const { setSynthToBuy, changeScreen } = this.props;
    return () => {
      console.log(currency);
      setSynthToBuy(currency);
      changeScreen('synthTransaction');
    };
  }

  async componentDidMount() {
    if (!synthetixJsTools.initialized) return;
    const { availableSynths } = this.props;
    const ratesObject = {};

    try {
      const ratesForCurrencies = await synthetixJsTools.havvenJs.ExchangeRates.ratesForCurrencies(
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
    const { availableSynths } = this.props;
    const { rates } = this.state;
    return availableSynths.map((synth, i) => {
      return (
        <tr key={i} onClick={this.buyCurrency(synth)}>
          <td>{synth}</td>
          <td>
            $
            {rates && rates[synth]
              ? numeral(rates[synth]).format('0,0.00000')
              : '--'}
          </td>
          {/* <td>--</td>
          <td>--</td>
          <td>--</td> */}
        </tr>
      );
    });
  }

  render() {
    return (
      <div className={styles.rateList}>
        <table>
          <thead>
            <tr>
              <th>Current Rate</th>
              <th>Rate</th>
              {/* <th>Low</th> */}
              {/* <th>High</th> */}
              {/* <th>Volume(sUSD)</th> */}
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
  };
};

const mapDispatchToProps = {
  changeScreen,
  setSynthToBuy,
};

RateList.propTypes = {
  availableSynths: PropTypes.array.isRequired,
  changeScreen: PropTypes.func.isRequired,
  setSynthToBuy: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RateList);
