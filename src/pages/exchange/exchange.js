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

import { walletSelectorPopupIsVisible } from '../../ducks/';

import styles from './exchange.module.scss';

class Exchange extends Component {
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
        <WalletSelectorPopup isVisible={walletSelectorPopupIsVisible} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state),
  };
};

const mapDispatchToProps = {};

Exchange.propTypes = {
  walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Exchange);
