import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';

import { getTransactions } from '../../utils/synthetixApi';
import Header from '../../components/header';
import Container from '../../components/container';

import styles from './transactions.module.scss';

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      transactions: null,
    };
  }

  async componentDidMount() {
    const transactions = await getTransactions();
    console.log(transactions);
    this.setState({ transactions });
  }
  renderTransactionTable() {
    return (
      <table cellSpacing="0" className={styles.transactionTable}>
        <thead>
          <tr>
            <th>
              <h2>Transaction History</h2>
            </th>
            <th>
              <h3>Rate</h3>
            </th>
            <th>
              <h3>Amount</h3>
            </th>
            <th>
              <h3>Date / Time</h3>
            </th>
          </tr>
        </thead>
        {/* <tbody>{this.renderTableBody()}</tbody> */}
      </table>
    );
  }

  render() {
    return (
      <div className={styles.transactions}>
        <div>
          <Header />
          <div className={styles.transactionsLayout}>
            <Container>{this.renderTransactionTable()}</Container>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {};

Transactions.propTypes = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);
