import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import numeral from 'numeral';

import {
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
} from '../../ducks/';
import { setSynthToExchange } from '../../ducks/synths';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import styles from './balance-checker.module.scss';

class BalanceChecker extends Component {
  constructor() {
    super();
    this.state = {
      balances: null,
    };
    this.selectSynthToExchange = this.selectSynthToExchange.bind(this);
  }

  selectSynthToExchange(synth) {
    return () => {
      const { setSynthToExchange } = this.props;
      setSynthToExchange(synth);
    };
  }

  async refreshData() {
    const { currentWalletInfo, availableSynths } = this.props;
    if (
      !synthetixJsTools.initialized ||
      !currentWalletInfo ||
      !currentWalletInfo.selectedWallet
    )
      return;
    const { selectedWallet } = currentWalletInfo;
    const balances = await Promise.all(
      availableSynths.map(synth => {
        return synthetixJsTools.havvenJs[synth].balanceOf(selectedWallet);
      })
    );
    this.setState({
      balances: balances.map(balance => formatBigNumber(balance, 6)),
    });
  }

  async componentDidMount() {
    this.refreshData();
  }

  async componentDidUpdate(prevProps) {
    const { currentWalletInfo } = this.props;
    if (
      currentWalletInfo.selectedWallet ===
      prevProps.currentWalletInfo.selectedWallet
    )
      return;
    this.refreshData();
  }

  renderBalance() {
    const { availableSynths, synthToExchange } = this.props;
    const { balances } = this.state;
    if (!availableSynths) return;
    return availableSynths.map((synth, i) => {
      return (
        <tr
          onClick={this.selectSynthToExchange(synth)}
          className={`${styles.tableBodyRow} ${
            synthToExchange && synthToExchange === synth
              ? styles.tableBodyRowActive
              : ''
          }`}
          key={i}
        >
          <td className={styles.tableBodySynth}>
            <img src={`images/synths/${synth}-icon.svg`} alt="synth icon" />
            <span>{synth}</span>
          </td>
          <td className={styles.tableBodyBalance}>
            {balances ? numeral(Number(balances[i])).format('0,0.00') : null}
          </td>
        </tr>
      );
    });
  }

  render() {
    const { currentWalletInfo } = this.props;
    return (
      <div className={styles.balanceChecker}>
        {currentWalletInfo && currentWalletInfo.selectedWallet ? (
          <h2 className={styles.balanceCheckerHeading}>Balances</h2>
        ) : null}
        <table cellPadding="0" cellSpacing="0" className={styles.table}>
          <thead>
            <tr>
              <th>
                <h3 className={styles.tableHeading}>Currencies</h3>
              </th>
            </tr>
          </thead>
          <tbody>{this.renderBalance()}</tbody>
        </table>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    availableSynths: getAvailableSynths(state),
    synthToExchange: getSynthToExchange(state),
  };
};

const mapDispatchToProps = {
  setSynthToExchange,
};

BalanceChecker.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthToExchange: PropTypes.string,
  setSynthToExchange: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BalanceChecker);
