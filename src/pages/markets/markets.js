import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import numbro from 'numbro';

import Container from '../../components/container';

import { getAvailableSynths, getExchangeRates } from '../../ducks/';
import { setSynthToExchange, setSynthToBuy } from '../../ducks/synths';
import { changeScreen } from '../../ducks/ui';
import styles from './markets.module.scss';

class Markets extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: '',
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.selectPair = this.selectPair.bind(this);
  }
  getPrecision(base, quote) {
    return quote === 'sXAU' && (base === 'sKRW' || base === 'sJPY')
      ? '0,0.00000000'
      : '0,0.00000';
  }

  selectPair(base, quote) {
    return () => {
      const { setSynthToExchange, setSynthToBuy, changeScreen } = this.props;
      setSynthToExchange(base);
      setSynthToBuy(quote);
      changeScreen('exchange');
    };
  }

  renderTableBody() {
    const { availableSynths, exchangeRates } = this.props;
    const { inputValue } = this.state;
    const filteredSynths = availableSynths.filter(synth => {
      return (
        synth.name !== 'XDR' &&
        synth.name.toUpperCase().includes(inputValue.toUpperCase())
      );
    });
    return filteredSynths.map(baseSynth => {
      const rates = exchangeRates[baseSynth.name];
      return (
        <Fragment key={`bloc-${baseSynth.name}`}>
          <tr className={styles.pairHeading}>
            <td>{baseSynth.name} Pairs: </td>
            <td>Price</td>
          </tr>
          {availableSynths
            .filter(
              quoteSynth =>
                baseSynth.name !== quoteSynth.name && quoteSynth.name !== 'XDR'
            )
            .map(quoteSynth => {
              return (
                <tr
                  key={`tr-${baseSynth.name}-${quoteSynth.name}`}
                  onClick={this.selectPair(baseSynth, quoteSynth)}
                >
                  <td>
                    {baseSynth.name} / {quoteSynth.name}
                  </td>
                  <td className={styles.rate}>
                    {quoteSynth.sign}
                    {numbro(rates[quoteSynth.name]).format(
                      this.getPrecision(baseSynth.name, quoteSynth.name)
                    )}
                  </td>
                </tr>
              );
            })}
        </Fragment>
      );
    });
  }

  onInputChange(e) {
    this.setState({ inputValue: e.target.value });
  }

  render() {
    const { inputValue } = this.state;
    return (
      <div className={styles.marketsLayout}>
        <Container width={'auto'} minHeight={'500px'}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a Synth..."
            value={inputValue}
            onChange={this.onInputChange}
          />
          <table cellSpacing="0" className={styles.marketsTable}>
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
  changeScreen,
};

Markets.propTypes = {
  availableSynths: PropTypes.array.isRequired,
  setSynthToExchange: PropTypes.func.isRequired,
  setSynthToBuy: PropTypes.func.isRequired,
  changeScreen: PropTypes.func.isRequired,
  exchangeRates: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Markets);
