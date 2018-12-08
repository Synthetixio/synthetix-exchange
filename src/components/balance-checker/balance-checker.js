import React, { Component } from 'react';
import styles from './balance-checker.module.scss';

class BalanceChecker extends Component {
  render() {
    return (
      <div className={styles.balanceChecker}>
        <div>sUSD</div>
        <div>sEUR</div>
        <div>sJPY</div>
        <div>sAUD</div>
        <div>sKRW</div>
        <div>sXAU</div>
      </div>
    );
  }
}

export default BalanceChecker;
