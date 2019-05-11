import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numbro from 'numbro';

import Container from '../../components/container';

import { getAvailableSynths, getExchangeRates } from '../../ducks/';
import { setSynthToExchange, setSynthToBuy } from '../../ducks/synths';
import styles from './markets.module.scss';

class Markets extends Component {
  getPrecision(base, quote) {
    return quote === 'sXAU' && (base === 'sKRW' || base === 'sJPY')
      ? '0,0.00000000'
      : '0,0.00000';
  }

  renderTableBody() {
    const { availableSynths, exchangeRates } = this.props;
    return availableSynths.map(baseSynth => {
      const rates = exchangeRates[baseSynth.name];
      return (
        <Fragment>
          <tr className={styles.pairHeading}>
            <td>{baseSynth.name} Pairs: </td>
            <td>Price</td>
          </tr>
          {Object.keys(exchangeRates[baseSynth.name])
            .filter(quoteSynth => baseSynth.name !== quoteSynth)
            .map(quoteSynth => {
              return (
                <tr>
                  <td>
                    {baseSynth.name} / {quoteSynth}
                  </td>
                  <td className={styles.rate}>
                    {baseSynth.sign}
                    {numbro(rates[quoteSynth]).format(
                      this.getPrecision(baseSynth.name, quoteSynth)
                    )}
                  </td>
                </tr>
              );
            })}
        </Fragment>
      );
    });
  }
  render() {
    return (
      <div className={styles.marketsLayout}>
        <Container minHeight={'500px'}>
          <table className={styles.marketsTable}>
            {/* <thead>
              <tr>
                <th />
                <th />
              </tr>
            </thead> */}
            <tbody>{this.renderTableBody()}</tbody>
          </table>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    availableSynths: getAvailableSynths(state),
    exchangeRates: getExchangeRates(state),
  };
};

const mapDispatchToProps = {
  setSynthToExchange,
  setSynthToBuy,
};

Markets.propTypes = {
  availableSynths: PropTypes.array.isRequired,
  setSynthToExchange: PropTypes.func.isRequired,
  setSynthToBuy: PropTypes.func.isRequired,
  exchangeRates: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Markets);
