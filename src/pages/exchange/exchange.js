import React, { Component } from 'react';

import Header from '../../components/header';
import Container from '../../components/container';
import BalanceChecker from '../../components/balance-checker';
import WalletConnector from '../../components/wallet-connector';
import Chart from '../../components/chart';
import RateList from '../../components/rate-list';
import WalletSelectorPopup from '../../components/wallet-selector-popup';

import styles from './exchange.module.scss';

class Exchange extends Component {
  render() {
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
                <WalletConnector />
              </Container>
            </div>
            <div className={styles.exchangeLayoutColumn}>
              <Container>
                <Chart />
                <RateList />
              </Container>
            </div>
          </div>
        </div>
        <WalletSelectorPopup isVisible={false} />
      </div>
    );
  }
}

export default Exchange;
