import React, { Component } from 'react';
import numbro from 'numbro';

import { getCompetitorsData } from './data'
import Container from '../container';
import { groupBy, sortBy, flatten } from 'lodash'

import styles from './trading-comp-table.module.scss';

class TradingComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      competitors: null,
    };
  }

  refreshData = () =>  {
    this.setState({ loading: true, competitors: null }, async () => {
      let competitors = await getCompetitorsData()
      competitors = groupBy(competitors, 'tier') // group by tiers
      competitors = [competitors.whale, competitors.dolphin, competitors.shrimp] // sort by tiers
      competitors = competitors.map(arr => sortBy(arr, elem => -elem.gain)) // sort every group independently
      competitors.forEach(arr => arr.push({})) // dummy elem to render spacer
      competitors = flatten(competitors)
      this.setState({competitors: competitors, loading: false})
    })
  }

  componentDidMount() {
    this.refreshData();
  }

  renderTableBody() {
    const { competitors } = this.state
    if (!competitors) return (<tr><td>Loading...</td></tr>);

    return competitors.map((competitor, index) => {
      const { address, title, tier, startingBalance, balance, gain, eligible, primarySynth } = competitor

      if (!title) return <tr key={index}><td style={{ height: '50px' }}> </td></tr> // spacer

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
          <td>{startingBalance == 0 ? '–' : primarySynth }</td>
          <td>{startingBalance == 0 ? '–' : numbro(gain || 0).format({output: 'percent', mantissa: 2})}</td>
          <td>{eligible}</td>
        </tr>
      );
    });
  }

  renderTradingCompTable() {
    const { loading } = this.state

    return (
      <div className={styles.tableWrapper}>
        <button
          disabled={loading}
          onClick={this.refreshData}
          className={styles.refreshButton}
        >
          Refresh
        </button>
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
                <h3>Primary Synth</h3>
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