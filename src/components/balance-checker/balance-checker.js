import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import numbro from 'numbro';

import {
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
  getEthRate,
  getCurrentExchangeMode,
} from '../../ducks/';
import { setSynthToExchange } from '../../ducks/synths';
import { setWalletBalances } from '../../ducks/wallet';
import { toggleLoadingScreen, toggleDepotPopup } from '../../ducks/ui';

import synthetixJsTools from '../../synthetixJsTool';
import { formatBigNumber } from '../../utils/converterUtils';
import RateList from '../rate-list';
import SynthPicker from '../synth-picker';

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
    const {
      synthetixJs,
      initialized,
      provider,
      getUtf8Bytes,
    } = synthetixJsTools;
    if (!initialized || !currentWalletInfo || !currentWalletInfo.selectedWallet)
      return;
    const { selectedWallet } = currentWalletInfo;
    let ethBalance = await provider.getBalance(selectedWallet);
    ethBalance = formatBigNumber(ethBalance, 2);
    const ethBalanceValue = ethBalance * ethRate;
    const balances = await Promise.all(
      availableSynths.map(synth => {
        return synthetixJs[synth.name].balanceOf(selectedWallet);
      })
    );

    const synthsBalance = {};
    const totalBalance = await Promise.all(
      balances.map((balance, i) => {
        return synthetixJs.Synthetix.effectiveValue(
          getUtf8Bytes(availableSynths[i].name),
          balance,
          getUtf8Bytes('sUSD')
        );
      })
    );

    balances.forEach(async (balance, i) => {
      synthsBalance[availableSynths[i].name] = formatBigNumber(balance, 6);
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

  renderWidgetHeader() {
    const { currentWalletInfo } = this.props;
    const buttonIsDisabled =
      !currentWalletInfo || !currentWalletInfo.selectedWallet;
    return (
      <div className={styles.widgetHeader}>
        <h2 className={styles.balanceCheckerHeading}>Balances</h2>
        <button
          disabled={buttonIsDisabled}
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

    const proxyERC20sUSDAddress = synthetixJsTools.synthetixJs
      ? synthetixJsTools.synthetixJs.contractSettings.addressList.ProxyERC20sUSD
      : '';
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
            <td className={styles.tableBodyBalance}>
              {totalBalance
                ? `$${numbro(totalBalance).format('0,0.00')} USD`
                : '--'}
            </td>
          </tr>
          <tr className={styles.tableBodyRow}>
            <td className={styles.tableBodySynth}>ETH</td>
            <td className={styles.tableBodyBalance}>
              <div>
                {ethBalance ? numbro(ethBalance.amount).format('0,0.00') : '--'}
              </div>
              <div>
                {ethBalance
                  ? `$${numbro(ethBalance.value).format('0,0.00')} USD`
                  : null}
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className={styles.tableBodyButtonRow}>
              <button
                disabled={true}
                onClick={this.showDepotPopup}
                className={`${styles.balanceCheckerButton} ${styles.balanceCheckerButtonWhite}`}
              >
                Buy sUSD with ETH
              </button>
              <a
                href={`https://uniswap.exchange/swap/${proxyERC20sUSDAddress}`}
                target="_blank"
                className={`${styles.balanceCheckerButton} ${styles.balanceCheckerButtonWhite} ${styles.balanceCheckerAnchor}`}
              >
                Buy with ETH on Uniswap
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderSynths() {
    const { currentExchangeMode } = this.props;
    return (
      <div>
        <h2 className={styles.tableHeading}>Your Synths</h2>
        <SynthPicker />
        {currentExchangeMode === 'pro' ? <RateList /> : null}
      </div>
    );
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
    currentExchangeMode: getCurrentExchangeMode(state),
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
  synthToExchange: PropTypes.object,
  setSynthToExchange: PropTypes.func.isRequired,
  setWalletBalances: PropTypes.func.isRequired,
  toggleLoadingScreen: PropTypes.func.isRequired,
  toggleDepotPopup: PropTypes.func.isRequired,
  ethRate: PropTypes.string,
  currentExchangeMode: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(BalanceChecker);
