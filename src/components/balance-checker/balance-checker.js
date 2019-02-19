import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import numbro from 'numbro';

import {
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
  getEthRate,
} from '../../ducks/';
import { setSynthToExchange } from '../../ducks/synths';
import { setWalletBalances } from '../../ducks/wallet';
import { toggleLoadingScreen, toggleDepotPopup } from '../../ducks/ui';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';

import { SYNTH_TYPES } from '../../synthsList';

import styles from './balance-checker.module.scss';

class BalanceChecker extends Component {
  constructor() {
    super();
    this.state = {
      totalBalance: null,
      balances: null,
    };
    this.selectSynthToExchange = this.selectSynthToExchange.bind(this);
    this.handleRefresh = this.handleRefresh.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.showDepotPopup = this.showDepotPopup.bind(this);
  }

  selectSynthToExchange(synth) {
    return () => {
      const { setSynthToExchange, synthToExchange } = this.props;
      if (synthToExchange === synth) return;
      setSynthToExchange(synth);
    };
  }

  showDepotPopup() {
    const { toggleDepotPopup } = this.props;
    toggleDepotPopup(true);
  }

  async refreshData() {
    const {
      currentWalletInfo,
      availableSynths,
      setWalletBalances,
      toggleLoadingScreen,
      ethRate,
    } = this.props;
    const { havvenJs, utils, initialized, provider } = synthetixJsTools;
    if (!initialized || !currentWalletInfo || !currentWalletInfo.selectedWallet)
      return;
    const { selectedWallet } = currentWalletInfo;
    let ethBalance = await provider.getBalance(selectedWallet);
    ethBalance = formatBigNumber(ethBalance, 2);
    const ethBalanceValue = ethBalance * ethRate;
    const balances = await Promise.all(
      availableSynths.map(synth => {
        return havvenJs[synth].balanceOf(selectedWallet);
      })
    );

    const synthsBalance = {};
    const totalBalance = await Promise.all(
      balances.map((balance, i) => {
        return havvenJs.Synthetix.effectiveValue(
          utils.toUtf8Bytes(availableSynths[i]),
          balance,
          utils.toUtf8Bytes('sUSD')
        );
      })
    );

    balances.forEach(async (balance, i) => {
      synthsBalance[availableSynths[i]] = formatBigNumber(balance, 6);
    });
    this.setState({
      balances: balances.map(balance => formatBigNumber(balance, 6)),
      ethBalance: {
        amount: ethBalance,
        value: ethBalanceValue.toFixed(2),
      },
      totalBalance: formatBigNumber(
        totalBalance.reduce((pre, curr) => pre.add(curr)),
        2
      ),
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

  renderBalance(synthType) {
    const { availableSynths, synthToExchange, currentWalletInfo } = this.props;
    const { balances } = currentWalletInfo;
    if (!availableSynths) return;
    return availableSynths
      .filter(synth => SYNTH_TYPES[synth] === synthType)
      .map((synth, i) => {
        return (
          <Fragment key={i}>
            <tr
              onClick={this.selectSynthToExchange(synth)}
              className={`${styles.tableBodyRow} ${
                synthToExchange && synthToExchange === synth
                  ? styles.tableBodyRowActive
                  : ''
              }`}
              key={`synth-${i}`}
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
            {synth === 'sUSD' &&
            synthToExchange &&
            synthToExchange === synth &&
            balances ? (
              <tr className={styles.tableBodyRowActive} key={`button-${i}`}>
                <td colSpan="2" className={styles.tableBodyButtonRow}>
                  <button
                    onClick={this.showDepotPopup}
                    className={`${styles.balanceCheckerButton} ${
                      styles.balanceCheckerButtonWhite
                    }`}
                  >
                    Buy with ETH
                  </button>
                </td>
              </tr>
            ) : null}
          </Fragment>
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
          className={styles.balanceCheckerButton}
        >
          Refresh
        </button>
      </div>
    );
  }

  renderTotalBalance() {
    const { totalBalance, ethBalance } = this.state;
    if (!totalBalance) return;
    return (
      <table cellPadding="0" cellSpacing="0" className={styles.table}>
        <thead>
          <tr>
            <th>
              <h3 className={styles.tableHeading}>Total</h3>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className={styles.tableBodyRow}>
            <td className={styles.tableBodySynth}>Synths</td>
            <td className={styles.tableBodyBalance}>${totalBalance}</td>
          </tr>
          <tr className={styles.tableBodyRow}>
            <td className={styles.tableBodySynth}>ETH</td>
            <td className={styles.tableBodyBalance}>
              <div>{ethBalance.amount}</div>
              <div>${ethBalance.value}</div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderTable(synthType, index) {
    const balance = this.renderBalance(synthType);
    if (!balance || balance.length === 0) return;
    return (
      <table
        key={index}
        cellPadding="0"
        cellSpacing="0"
        className={styles.table}
      >
        <thead>
          <tr>
            <th>
              <h3 className={styles.tableHeading}>{synthType}</h3>
            </th>
          </tr>
        </thead>
        <tbody>{balance}</tbody>
      </table>
    );
  }

  renderSynths() {
    return ['currencies', 'commodities', 'stocks'].map(this.renderTable);
  }

  render() {
    return (
      <div className={styles.balanceChecker}>
        {this.renderWidgetHeader()}
        {this.renderTotalBalance()}
        {this.renderSynths()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
    availableSynths: getAvailableSynths(state),
    synthToExchange: getSynthToExchange(state),
    ethRate: getEthRate(state),
  };
};

const mapDispatchToProps = {
  setSynthToExchange,
  setWalletBalances,
  toggleLoadingScreen,
  toggleDepotPopup,
};

BalanceChecker.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthToExchange: PropTypes.string,
  setSynthToExchange: PropTypes.func.isRequired,
  setWalletBalances: PropTypes.func.isRequired,
  toggleLoadingScreen: PropTypes.func.isRequired,
  toggleDepotPopup: PropTypes.func.isRequired,
  ethRate: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BalanceChecker);
