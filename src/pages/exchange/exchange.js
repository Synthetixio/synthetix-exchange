import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Header from '../../components/header';
import Container from '../../components/container';
import BalanceChecker from '../../components/balance-checker';
import WalletConnector from '../../components/wallet-connector';
import Chart from '../../components/chart';
import RateList from '../../components/rate-list';
import WalletSelectorPopup from '../../components/wallet-selector-popup';
import TradingWidget from '../../components/trading-widget';

import {
  walletSelectorPopupIsVisible,
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
  getSynthToBuy,
} from '../../ducks/';
import { setAvailableSynths } from '../../ducks/synths';

import synthetixJsTools from '../../synthetixJsTool';

import styles from './exchange.module.scss';

class Exchange extends Component {
  componentWillMount() {
    synthetixJsTools.setContractSettings();
  }

  componentDidMount() {
    this.refreshData();
  }

  async refreshData() {
    if (!synthetixJsTools.initialized) return;
    try {
    } catch (e) {
      console.log('Error while fetching data from smart contract', e);
    }
  }

  renderWalletConnectorOrTradingWidget() {
    const { currentWalletInfo, synthToBuy, synthToExchange } = this.props;
    return synthToBuy &&
      synthToExchange &&
      currentWalletInfo &&
      currentWalletInfo.selectedWallet ? (
      <TradingWidget />
    ) : (
      <WalletConnector />
    );
  }

  render() {
    const { walletSelectorPopupIsVisible } = this.props;
    return (
      <div className={styles.exchange}>
        <div className={styles.exchangeInner}>
          <Header />
          <div className={styles.exchangeLayout}>
            <div
              className={`${styles.exchangeLayoutColumn} ${
                styles.exchangeLayoutColumnSmall
              }`}
            >
              <Container>
                <BalanceChecker />
              </Container>
              <Container>
                {this.renderWalletConnectorOrTradingWidget()}
              </Container>
            </div>
            <div className={styles.exchangeLayoutColumn}>
              <Container>
                {/* <Chart /> */}
                <RateList />
              </Container>
            </div>
          </div>
        </div>
        <WalletSelectorPopup isVisible={walletSelectorPopupIsVisible} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state),
    currentWalletInfo: getCurrentWalletInfo(state),
    availableSynths: getAvailableSynths(state),
    synthToBuy: getSynthToBuy(state),
    synthToExchange: getSynthToExchange(state),
  };
};

const mapDispatchToProps = {
  setAvailableSynths,
};

Exchange.propTypes = {
  walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
  setAvailableSynths: PropTypes.func.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthToBuy: PropTypes.string,
  synthToExchange: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange);
