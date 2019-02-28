import React, { Component } from 'react';
import { connect } from 'react-redux';
import { format } from 'date-fns';
import PropTypes from 'prop-types';

import { getCurrentWalletInfo } from '../../ducks/';

import { getTransactions } from '../../utils/synthetixApi';
import Header from '../../components/header';
import Container from '../../components/container';

import styles from './transactions.module.scss';

class Transactions extends Component {
  constructor() {
    super();
    this.state = {
      allTransactions: null,
      transactions: null,
      showAllTrades: true,
    };
    this.toggleShowMyTrades = this.toggleShowMyTrades.bind(this);
  }

  async componentDidMount() {
    const transactions = await getTransactions();
    const filteredTransactions = transactions.filter(
      transaction => !transaction.exchangeToCurrency.includes('XDR')
    );
    this.setState({
      allTransactions: filteredTransactions,
      transactions: filteredTransactions,
    });
  }

  toggleShowMyTrades() {
    const { allTransactions, showAllTrades } = this.state;
    const { currentWalletInfo } = this.props;
    if (!currentWalletInfo.selectedWallet) return;
    const transactionsToShow = showAllTrades
      ? allTransactions
      : allTransactions.filter(
          transaction => transaction.from === currentWalletInfo.selectedWallet
        );
    this.setState({
      transactions: transactionsToShow,
      showAllTrades: !showAllTrades,
    });
  }

  renderTransactionSynths(transaction) {
    const { exchangeFromCurrency, exchangeToCurrency } = transaction;
    return (
      <div className={styles.transactionTableSynth}>
        <div className={styles.transactionPair}>
          <img src={`images/synths/${exchangeFromCurrency}-icon.svg`} />
          <span>{exchangeFromCurrency}</span>
        </div>
        /
        <div className={styles.transactionPair}>
          <img src={`images/synths/${exchangeToCurrency}-icon.svg`} />
          <span>{exchangeToCurrency}</span>
        </div>
      </div>
    );
  }

  renderTableBody() {
    const { transactions } = this.state;
    if (!transactions) return null;
    return transactions.map((transaction, index) => {
      return (
        <tr key={index}>
          <td>{this.renderTransactionSynths(transaction)}</td>
          <td>
            {transaction.exchangeFromAmount / transaction.exchangeToAmount}
          </td>
          <td>{transaction.exchangeToAmount}</td>
          <td>
            {format(new Date(transaction.blockTimestamp), 'H:mmA D/M/YYYY')}
          </td>
          <td className={styles.transactionLinkWrapper}>
            <a
              className={styles.transactionLink}
              href={`https://etherscan.io/tx/${transaction.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              See transaction
            </a>
          </td>
        </tr>
      );
    });
  }

  renderTransactionTable() {
    const { showAllTrades } = this.state;
    return (
      <table cellSpacing="0" className={styles.transactionTable}>
        <thead>
          <tr>
            <th className={styles.headingWrapper}>
              <h2>Trade History</h2>
              <button onClick={this.toggleShowMyTrades}>
                {showAllTrades ? 'Show my trades' : 'Show all trades'}
              </button>
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
            <th />
          </tr>
        </thead>
        <tbody>{this.renderTableBody()}</tbody>
      </table>
    );
  }

  render() {
    const { transactions } = this.state;
    return (
      <div className={styles.transactions}>
        <div>
          <Header />
          <div className={styles.transactionsLayout}>
            <Container minHeight={'500px'}>
              {this.renderTransactionTable()}
              {!transactions || transactions.length === 0 ? (
                <h2 style={{ marginTop: '40px' }}>No Trades recorded.</h2>
              ) : null}
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentWalletInfo: getCurrentWalletInfo(state),
  };
};

const mapDispatchToProps = {};

Transactions.propTypes = {
  currentWalletInfo: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Transactions);
