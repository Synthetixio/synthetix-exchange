import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Popup from '../popup';

import { toggleTestnetPopup } from '../../ducks/ui';
import { getCurrentWalletInfo } from '../../ducks';

import styles from './testnet-popup.module.scss';

class WalletSelectorPopup extends Component {
	constructor() {
		super();
		this.closePopup = this.closePopup.bind(this);
	}

	closePopup() {
		const { toggleTestnetPopup } = this.props;
		toggleTestnetPopup(false);
	}

	renderFaucetLink() {
		const { currentWalletInfo } = this.props;
		const networkId = currentWalletInfo.networkId;
		switch (networkId) {
			case '3':
				return (
					<a href="https://faucet.metamask.io/" target="_blank" rel="noopener noreferrer">
						ROPSTEN faucet.
					</a>
				);
			case '42':
				return (
					<a href="https://github.com/kovan-testnet/" target="_blank" rel="noopener noreferrer">
						KOVAN faucet.
					</a>
				);
		}
	}

	render() {
		const { isVisible } = this.props;
		return (
			<Popup isVisible={isVisible} closePopup={this.closePopup}>
				<div className={styles.testnetPopup}>
					<h1>This is Demo Mode for testing</h1>
					<h2>TESTNET mode</h2>
					<div className={styles.steps}>
						<div className={styles.step}>
							To get started with Synthetix Exchange on Testnet first get some ETH from{' '}
							{this.renderFaucetLink()}
						</div>
					</div>
				</div>
			</Popup>
		);
	}
}

const mapStateToProps = state => {
	return {
		currentWalletInfo: getCurrentWalletInfo(state),
	};
};
const mapDispatchToProps = {
	toggleTestnetPopup,
};

WalletSelectorPopup.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	currentWalletInfo: PropTypes.object.isRequired,
	toggleTestnetPopup: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletSelectorPopup);
