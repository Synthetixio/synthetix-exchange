import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Header from '../../components/header';
import Container from '../../components/container';
import BalanceChecker from '../../components/balance-checker';
import WalletConnector from '../../components/wallet-connector';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import RateList from '../../components/rate-list';
import TradingWidget from '../../components/trading-widget';

import {
  walletSelectorPopupIsVisible,
  transactionStatusPopupIsVisible,
  testnetPopupIsVisible,
  depotPopupIsVisible,
  feedbackPopupIsVisible,
  walkthroughPopupIsVisible,
  loadingScreenIsVisible,
  getCurrentWalletInfo,
  getAvailableSynths,
  getSynthToExchange,
  getSynthToBuy,
} from '../../ducks/';
import { setAvailableSynths } from '../../ducks/synths';

import { CURRENCY_TABLE } from '../../synthsList';

import styles from './exchange.module.scss';

class Exchange extends Component {
  renderWalletConnectorOrTradingWidget() {
    const { currentWalletInfo } = this.props;
    return currentWalletInfo && currentWalletInfo.selectedWallet ? (
      <TradingWidget />
    ) : (
      <WalletConnector />
    );
  }

  getSymbol() {
    const { synthToBuy, synthToExchange } = this.props;
    if (
      synthToBuy == 'sXAU' ||
      synthToBuy === 'sBTC' ||
      synthToBuy === 'sXAG'
    ) {
      return CURRENCY_TABLE[synthToBuy] + CURRENCY_TABLE[synthToExchange];
    } else return CURRENCY_TABLE[synthToExchange] + CURRENCY_TABLE[synthToBuy];
  }

  render() {
    const symbol = this.getSymbol();
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
              <Container fullHeight={true}>
                <BalanceChecker />
              </Container>
              <Container>
                {this.renderWalletConnectorOrTradingWidget()}
              </Container>
            </div>
            <div className={styles.exchangeLayoutColumn}>
              <Container>
                <div className={styles.chartWrapper}>
                  <div className={styles.mask} />
                  <TradingViewWidget
                    symbol={symbol}
                    theme={Themes.DARK}
                    autosize
                    allow_symbol_change={false}
                    hide_legend={false}
                    save_image={false}
                  />
                </div>
                <RateList />
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state),
    transactionStatusPopupIsVisible: transactionStatusPopupIsVisible(state),
    testnetPopupIsVisible: testnetPopupIsVisible(state),
    depotPopupIsVisible: depotPopupIsVisible(state),
    feedbackPopupIsVisible: feedbackPopupIsVisible(state),
    walkthroughPopupIsVisible: walkthroughPopupIsVisible(state),
    loadingScreenIsVisible: loadingScreenIsVisible(state),
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
  transactionStatusPopupIsVisible: PropTypes.bool.isRequired,
  testnetPopupIsVisible: PropTypes.bool.isRequired,
  depotPopupIsVisible: PropTypes.bool.isRequired,
  feedbackPopupIsVisible: PropTypes.bool.isRequired,
  walkthroughPopupIsVisible: PropTypes.bool.isRequired,
  loadingScreenIsVisible: PropTypes.bool.isRequired,
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
