import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Header from '../../components/header';
import Footer from '../../components/footer';
import Exchange from '../exchange';
import ConnectToWallet from '../connect-to-wallet';
import Transactions from '../transactions';
import Markets from '../markets';
import AppDown from '../app-down';

import Overlay from '../../components/overlay';
import WalletSelectorPopup from '../../components/wallet-selector-popup';
import TransactionStatusPopup from '../../components/transaction-status-popup';
import TestnetPopup from '../../components/testnet-popup';
import DepotPopup from '../../components/depot-popup';
import FeedbackPopup from '../../components/feedback-popup';
import WalkthroughPopup from '../../components/walkthrough-popup';
import LoadingScreen from '../../components/loading-screen';

import {
  getCurrentScreen,
  getAvailableSynths,
  transactionStatusPopupIsVisible,
  depotPopupIsVisible,
  feedbackPopupIsVisible,
  testnetPopupIsVisible,
  loadingScreenIsVisible,
  walkthroughPopupIsVisible,
  walletSelectorPopupIsVisible,
} from '../../ducks/';
import {
  updateExchangeRates,
  setAvailableSynths,
  updateFrozenSynths,
} from '../../ducks/synths';
import { toggleLoadingScreen } from '../../ducks/ui';
import { connectToWallet, updateGasAndSpeedInfo } from '../../ducks/wallet';
import { getEthereumNetwork } from '../../utils/metamaskTools';
import synthetixJsTools from '../../synthetixJsTool';
import { getGasAndSpeedInfo } from '../../utils/ethUtils';

import styles from './root.module.scss';

class Root extends Component {
  constructor() {
    super();
    this.refreshData = this.refreshData.bind(this);
  }

  async updateRates() {
    const {
      availableSynths,
      updateExchangeRates,
      toggleLoadingScreen,
    } = this.props;
    if (!availableSynths) return;
    let formattedSynthRates = {};
    try {
      const [synthRates, ethRate] = await Promise.all([
        synthetixJsTools.synthetixJs.ExchangeRates.ratesForCurrencies(
          availableSynths.map(synth =>
            synthetixJsTools.utils.toUtf8Bytes4(synth.name)
          )
        ),
        synthetixJsTools.synthetixJs.Depot.usdToEthPrice(),
      ]);
      synthRates.forEach((rate, i) => {
        formattedSynthRates[availableSynths[i].name] = Number(
          synthetixJsTools.synthetixJs.utils.formatEther(rate)
        );
      });
      const formattedEthRate = synthetixJsTools.synthetixJs.utils.formatEther(
        ethRate
      );
      updateExchangeRates(formattedSynthRates, formattedEthRate);
      toggleLoadingScreen(false);
    } catch (e) {
      console.log(e);
    }
  }

  async updateGasAndSpeedPrices() {
    const { updateGasAndSpeedInfo } = this.props;
    const gasAndSpeedInfo = await getGasAndSpeedInfo();
    updateGasAndSpeedInfo(gasAndSpeedInfo);
  }

  async getFrozenSynths() {
    const { availableSynths, updateFrozenSynths } = this.props;
    if (!availableSynths) return;
    let frozenSynths = {};
    const inverseSynths = availableSynths
      .filter(synth => synth.name.charAt(0) === 'i')
      .map(synth => synth.name);
    const results = await Promise.all(
      inverseSynths.map(synth =>
        synthetixJsTools.synthetixJs.ExchangeRates.rateIsFrozen(
          synthetixJsTools.utils.toUtf8Bytes4(synth)
        )
      )
    );
    results.forEach((isFrozen, index) => {
      if (isFrozen) frozenSynths[inverseSynths[index]] = true;
    });
    updateFrozenSynths(frozenSynths);
  }

  refreshData() {
    this.updateRates();
    this.getFrozenSynths();
    this.updateGasAndSpeedPrices();
  }

  async componentDidMount() {
    const {
      toggleLoadingScreen,
      connectToWallet,
      setAvailableSynths,
      currentScreen,
    } = this.props;
    if (currentScreen === 'appDown') return;
    toggleLoadingScreen(true);
    setInterval(this.refreshData, 60 * 1000);
    const { networkId } = await getEthereumNetwork();
    synthetixJsTools.setContractSettings({ networkId });
    // We remove all the synths which aren't considered as assets (eg: XDR)
    const allSynths = synthetixJsTools.synthetixJs.contractSettings.synths.filter(
      synth => synth.asset
    );
    setAvailableSynths(allSynths);
    connectToWallet({
      networkId,
    });
    this.refreshData();
  }

  renderScreen() {
    const { currentScreen } = this.props;
    switch (currentScreen) {
      case 'exchange':
        return <Exchange />;
      case 'connectToWallet':
        return <ConnectToWallet />;
      case 'transactions':
        return <Transactions />;
      case 'markets':
        return <Markets />;
      case 'appDown':
        return <AppDown />;
      default:
        return <Exchange />;
    }
  }

  hasOpenPopup() {
    const {
      transactionStatusPopupIsVisible,
      depotPopupIsVisible,
      feedbackPopupIsVisible,
      testnetPopupIsVisible,
      loadingScreenIsVisible,
      walletSelectorPopupIsVisible,
      walkthroughPopupIsVisible,
    } = this.props;
    return (
      transactionStatusPopupIsVisible ||
      depotPopupIsVisible ||
      testnetPopupIsVisible ||
      loadingScreenIsVisible ||
      walletSelectorPopupIsVisible ||
      feedbackPopupIsVisible ||
      walkthroughPopupIsVisible
    );
  }
  render() {
    const {
      walletSelectorPopupIsVisible,
      transactionStatusPopupIsVisible,
      loadingScreenIsVisible,
      testnetPopupIsVisible,
      depotPopupIsVisible,
      feedbackPopupIsVisible,
      walkthroughPopupIsVisible,
      currentScreen,
    } = this.props;
    const overlayIsVisible = this.hasOpenPopup();
    return (
      <div className={styles.root}>
        <Overlay isVisible={overlayIsVisible} />
        <div className={styles.rootInner}>
          {currentScreen !== 'appDown' ? <Header /> : null}
          <div className={styles.mainComponentWrapper}>
            {this.renderScreen()}
          </div>
          {currentScreen !== 'appDown' ? <Footer /> : null}
        </div>
        <WalletSelectorPopup isVisible={walletSelectorPopupIsVisible} />
        <TransactionStatusPopup isVisible={transactionStatusPopupIsVisible} />
        <TestnetPopup isVisible={testnetPopupIsVisible} />
        <DepotPopup isVisible={depotPopupIsVisible} />
        <FeedbackPopup isVisible={feedbackPopupIsVisible} />
        <LoadingScreen isVisible={loadingScreenIsVisible} />
        {walkthroughPopupIsVisible ? (
          <WalkthroughPopup isVisible={walkthroughPopupIsVisible} />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentScreen: getCurrentScreen(state),
    availableSynths: getAvailableSynths(state),
    transactionStatusPopupIsVisible: transactionStatusPopupIsVisible(state),
    depotPopupIsVisible: depotPopupIsVisible(state),
    feedbackPopupIsVisible: feedbackPopupIsVisible(state),
    testnetPopupIsVisible: testnetPopupIsVisible(state),
    loadingScreenIsVisible: loadingScreenIsVisible(state),
    walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state),
    walkthroughPopupIsVisible: walkthroughPopupIsVisible(state),
  };
};

const mapDispatchToProps = {
  updateExchangeRates,
  setAvailableSynths,
  toggleLoadingScreen,
  connectToWallet,
  updateGasAndSpeedInfo,
  updateFrozenSynths,
};

Root.propTypes = {
  updateExchangeRates: PropTypes.func.isRequired,
  setAvailableSynths: PropTypes.func.isRequired,
  currentScreen: PropTypes.string.isRequired,
  availableSynths: PropTypes.array.isRequired,
  toggleLoadingScreen: PropTypes.func.isRequired,
  connectToWallet: PropTypes.func.isRequired,
  updateGasAndSpeedInfo: PropTypes.func.isRequired,
  transactionStatusPopupIsVisible: PropTypes.bool.isRequired,
  depotPopupIsVisible: PropTypes.bool.isRequired,
  feedbackPopupIsVisible: PropTypes.bool.isRequired,
  testnetPopupIsVisible: PropTypes.bool.isRequired,
  walkthroughPopupIsVisible: PropTypes.bool.isRequired,
  loadingScreenIsVisible: PropTypes.bool.isRequired,
  walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
  updateFrozenSynths: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
