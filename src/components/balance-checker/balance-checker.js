import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import numbro from 'numbro';

import {
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
} from '../../ducks/';
import { setSynthToExchange } from '../../ducks/synths';
import { setWalletBalances } from '../../ducks/wallet';
import { toggleLoadingScreen } from '../../ducks/ui';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import styles from './balance-checker.module.scss';

class BalanceChecker extends Component {
  constructor() {
    super();
    this.selectSynthToExchange = this.selectSynthToExchange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  selectSynthToExchange(synth) {
    return () => {
      const { setSynthToExchange, synthToExchange } = this.props;
      if (synthToExchange === synth) return;
      setSynthToExchange(synth);
    };
  }

  async refreshData() {
    const {
      currentWalletInfo,
      availableSynths,
      setWalletBalances,
      toggleLoadingScreen,
    } = this.props;
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
    const synthsBalance = {};
    balances.forEach((balance, i) => {
      synthsBalance[availableSynths[i]] = formatBigNumber(balance, 6);
    });
    toggleLoadingScreen(false);
    setWalletBalances(synthsBalance);
  }

  componentDidMount() {
    this.refreshData();
  }

  handleRefresh() {
    const { toggleLoadingScreen } = this.props;
    toggleLoadingScreen(true);
    this.refreshData();
  }

  walletHasChanged(prevProps) {
    const { currentWalletInfo } = this.props;
    return (
      currentWalletInfo.selectedWallet !==
      prevProps.currentWalletInfo.selectedWallet
    );
  }

  transactionWentThrough(prevProps) {
    const { currentWalletInfo } = this.props;
    const prevWalletInfo = prevProps.currentWalletInfo;
    const { transactionStatus } = currentWalletInfo;
    return (
      prevWalletInfo &&
      prevWalletInfo.transactionStatus &&
      prevWalletInfo.transactionStatus !== transactionStatus &&
      transactionStatus === 'cleared'
    );
  }

  componentDidUpdate(prevProps) {
    const { toggleLoadingScreen } = this.props;
    if (
      this.transactionWentThrough(prevProps) ||
      this.walletHasChanged(prevProps)
    ) {
      toggleLoadingScreen(true);
      this.refreshData();
    }
  }

  renderBalance() {
    const { availableSynths, synthToExchange, currentWalletInfo } = this.props;
    const { balances } = currentWalletInfo;
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
            {balances && balances[synth]
              ? numbro(Number(balances[synth])).format('0,0.00')
              : null}
          </td>
        </tr>
      );
    });
  }

  renderWidgetHeader() {
    const { currentWalletInfo } = this.props;
    if (!currentWalletInfo || !currentWalletInfo.selectedWallet) return;
    return (
      <div className={styles.widgetHeader}>
        <h2 className={styles.balanceCheckerHeading}>Balances</h2>
        <button
          onClick={this.handleRefresh}
          className={styles.widgetHeaderButton}
        >
          Refresh
        </button>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.balanceChecker}>
        {this.renderWidgetHeader()}
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
  setWalletBalances,
  toggleLoadingScreen,
};

BalanceChecker.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthToExchange: PropTypes.string,
  setSynthToExchange: PropTypes.func.isRequired,
  setWalletBalances: PropTypes.func.isRequired,
  toggleLoadingScreen: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BalanceChecker);
