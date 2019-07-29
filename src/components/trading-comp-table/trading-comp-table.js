import React, { Component } from 'react';
import numbro from 'numbro';

import { getCompetitorsData } from './data'
import Container from '../container';

import styles from './trading-comp-table.module.scss';

class TradingComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      competitors: null,
    };
  }

  async refreshData() {
    const competitors = await getCompetitorsData()
    console.log(competitors)
    this.setState({competitors: competitors})
  }

  componentDidMount() {
    this.refreshData();
  }

  renderTableBody() {
    const { competitors } = this.state
    if (!competitors) return (<tr><td>Loading...</td></tr>);

    return competitors.map((competitor, index) => {
      const { address, title, tier, startingBalance, balance, gain, eligible } = competitor
      return (
        <tr key={index}>
          <td>
              <a className={styles.walletLink}
                href={`https://etherscan.io/address/${address}#tokentxns`}
                target="_blank">
                  {title || address}
              </a>
          </td>
          <td>{tier || 'shrimp'}</td>
          <td>{startingBalance == 0 ? '–' : numbro(startingBalance || 0).format('$0,0.00')}</td>
          <td>{startingBalance == 0 ? '–' : numbro(balance || 0).format('$0,0.00')}</td>
          <td>{startingBalance == 0 ? '–' : numbro(gain || 0).format({output: 'percent', mantissa: 2})}</td>
          <td>{eligible}</td>
        </tr>
      );
    });
  }

  renderTradingCompTable() {
    return (
      <div className={styles.tableWrapper}>
        <table cellSpacing="0" className={styles.tradindCompTable}>
          <thead>
            <tr>
              <th>
                <h3>Name + wallet</h3>
              </th>
              <th>
                <h3>Tier</h3>
              </th>
              <th>
                <h3>Starting balance (sUSD)</h3>
              </th>
              <th>
                <h3>Current balance (sUSD)</h3>
              </th>
              <th>
                <h3>% gain</h3>
              </th>
              <th>
                <h3>Still eligible?</h3>
              </th>
            </tr>
          </thead>
          <tbody>{this.renderTableBody()}</tbody>
        </table>
      </div>
    );
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <div className={styles.tradingCompLayout}>
          <Container minHeight={'500px'}>
            {this.renderTradingCompTable()}
          </Container>
        </div>
      </div>
    );
  }
}



export default TradingComp