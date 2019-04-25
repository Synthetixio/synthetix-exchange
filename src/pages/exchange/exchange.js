import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Header from '../../components/header';
import Container from '../../components/container';
import BalanceChecker from '../../components/balance-checker';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import TradingWidget from '../../components/trading-widget';
import Transactions from '../transactions';

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

import styles from './exchange.module.scss';

class Exchange extends Component {
  getSymbol() {
    const { synthToBuy, synthToExchange } = this.props;
    if (!synthToBuy || !synthToExchange) return;
    if (
      synthToBuy.category == 'commodity' ||
      synthToBuy.category === 'crypto'
    ) {
      return synthToBuy.name.substring(1) + synthToExchange.name.substring(1);
    } else
      return synthToExchange.name.substring(1) + synthToBuy.name.substring(1);
  }

  render() {
    const { synthToBuy, synthToExchange } = this.props;
    const symbol = this.getSymbol();
    return (
      <div className={styles.exchange}>
        <div className={styles.exchangeInner}>
          <Header />
          <div className={styles.exchangeLayout}>
            <div
              className={`${styles.exchangeLayoutColumn} ${
                styles.exchangeLayoutColumnSmall
              } ${styles.exchangeLayoutColumnLeft}`}
            >
              <Container fullHeight={true}>
                <BalanceChecker />
              </Container>
            </div>
            <div className={styles.exchangeLayoutColumn}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '100%' }} className={styles.chartWrapper}>
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
                <div
                  style={{ height: '400px' }}
                  className={`${styles.exchangeLayoutColumn} ${
                    styles.exchangeLayoutColumnSmall
                  } ${styles.exchangeLayoutColumnRight}`}
                >
                  {synthToBuy && synthToExchange ? (
                    <Container fullHeight={true}>
                      <TradingWidget />
                    </Container>
                  ) : null}
                </div>
              </div>
              <div style={{ marginTop: '5px' }} />
              <Transactions />
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

const mapDispatchToProps = {};

Exchange.propTypes = {
  walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
  transactionStatusPopupIsVisible: PropTypes.bool.isRequired,
  testnetPopupIsVisible: PropTypes.bool.isRequired,
  depotPopupIsVisible: PropTypes.bool.isRequired,
  feedbackPopupIsVisible: PropTypes.bool.isRequired,
  walkthroughPopupIsVisible: PropTypes.bool.isRequired,
  loadingScreenIsVisible: PropTypes.bool.isRequired,
  currentWalletInfo: PropTypes.object.isRequired,
  availableSynths: PropTypes.array.isRequired,
  synthToBuy: PropTypes.object,
  synthToExchange: PropTypes.object,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange);
