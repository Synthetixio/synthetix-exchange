import React, { Component } from 'react';

import Header from '../../components/header';
import Container from '../../components/container';
import BalanceChecker from '../../components/balance-checker';
import WalletConnector from '../../components/wallet-connector';
import Chart from '../../components/chart';
import RateList from '../../components/rate-list';

import styles from './root.module.scss';

class Root extends Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.rootInner}>
          <Header />
          <div className={styles.rootLayout}>
            <div
              className={`${styles.rootLayoutColumn} ${
                styles.rootLayoutColumnSmall
              }`}
            >
              <Container>
                <BalanceChecker />
              </Container>
              <Container>
                <WalletConnector />
              </Container>
            </div>
            <div className={styles.rootLayoutColumn}>
              <Container>
                <Chart />
                <RateList />
              </Container>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Root;
