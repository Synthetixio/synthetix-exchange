import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Exchange from '../exchange';
import ConnectToWallet from '../connect-to-wallet';

import Overlay from '../../components/overlay';

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
import { updateExchangeRates } from '../../ducks/synths';
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
            synthetixJsTools.utils.toUtf8Bytes(synth)
          )
        ),
        synthetixJsTools.synthetixJs.Depot.usdToEthPrice(),
      ]);
      synthRates.forEach((rate, i) => {
        formattedSynthRates[availableSynths[i]] = Number(
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

  refreshData() {
    this.updateRates();
    this.updateGasAndSpeedPrices();
  }

  async componentDidMount() {
    const { toggleLoadingScreen, connectToWallet } = this.props;
    toggleLoadingScreen(true);
    setInterval(this.refreshData, 60 * 1000);
    const { networkId } = await getEthereumNetwork();
    synthetixJsTools.setContractSettings({ networkId });
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
    const overlayIsVisible = this.hasOpenPopup();
    return (
      <div className={styles.root}>
        <Overlay isVisible={overlayIsVisible} />
        {this.renderScreen()}
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
  toggleLoadingScreen,
  connectToWallet,
  updateGasAndSpeedInfo,
};

Root.propTypes = {
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Root);
