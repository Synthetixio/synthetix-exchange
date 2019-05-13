import React, { Component } from 'react';
import TransactionsTable from '../../components/transactions-table';
import styles from './transactions.module.scss';

class Transactions extends Component {
  render() {
    return (
      <div className={styles.transactionsLayout}>
        <TransactionsTable />
      </div>
    );
  }
}

export default Transactions;
