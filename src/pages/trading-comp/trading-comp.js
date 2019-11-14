import React, { Component } from 'react';
import TradingCompTable from '../../components/trading-comp-table';
import styles from './trading-comp.module.scss';

class TradingComp extends Component {
	render() {
		return (
			<div className={styles.tradingCompLayout}>
				<TradingCompTable />
			</div>
		);
	}
}

export default TradingComp;
