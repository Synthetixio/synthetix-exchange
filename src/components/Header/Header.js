import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import Logo from '../Logo';
import ThemeSwitcher from '../ThemeSwitcher';
import WalletAddressWidget from '../WalletAddressWidget';

import { ButtonPrimarySmall } from '../Button';
import { LabelMedium, DataMedium } from '../Typography';
import { toggleWalletPopup } from '../../ducks/ui';
import { getWalletInfo } from '../../ducks';

const Header = ({ toggleWalletPopup, walletInfo }) => {
	const { currentWallet, networkName } = walletInfo;
	return (
		<Container>
			<HeaderBlock>
				<Logo />
				<Network>
					<NetworkLabel>{networkName || 'mainnet'}</NetworkLabel>
				</Network>
			</HeaderBlock>
			<HeaderBlock>
				<HeaderLink to={'/trade'}>
					<HeaderLabel>Trade</HeaderLabel>
				</HeaderLink>
				<HeaderLink to={'/'}>
					<HeaderLabel>Markets</HeaderLabel>
				</HeaderLink>
				<HeaderLink to={'/'}>
					<HeaderLabel>Tokens</HeaderLabel>
				</HeaderLink>
				<HeaderLabel style={{ margin: '0 24px' }}>A / 诶</HeaderLabel>
				<HeaderLink to={'/'}>
					<HeaderLabel>Support</HeaderLabel>
				</HeaderLink>
				<ThemeSwitcher />
				{currentWallet ? (
					<WalletAddressWidget />
				) : (
					<ButtonPrimarySmall onClick={() => toggleWalletPopup(true)}>
						Connect wallet
					</ButtonPrimarySmall>
				)}
			</HeaderBlock>
		</Container>
	);
};

const Container = styled.div`
	height: 56px;
	background-color: ${props => props.theme.colors.surfaceL3};
	display: flex;
	align-items: center;
	padding: 0 24px;
	justify-content: space-between;
`;

const Network = styled.div`
	display: flex;
	align-items: center;
	height: 32px;
	background-color: ${props => props.theme.colors.accentDark};
	margin-left: 26px;
	padding: 0 12px;
`;

const HeaderBlock = styled.div`
	display: flex;
	align-items: center;
	& > * {
		margin: 0 12px;
	}
`;

const HeaderLabel = styled(LabelMedium)`
	text-transform: uppercase;
	color: ${props => props.theme.colors.fontTertiary};
	&:hover {
		color: ${props => props.theme.colors.fontSecondary};
	}
`;

const HeaderLink = styled(Link)`
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`;

const NetworkLabel = styled(DataMedium)`
	text-transform: uppercase;
	color: ${props => props.theme.colors.fontTertiary};
`;

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

const mapDispatchToProps = {
	toggleWalletPopup,
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';

// import {
// 	getCurrentWalletInfo,
// 	testnetPopupIsVisible,
// 	getCurrentScreen,
// 	getCurrentExchangeMode,
// 	walletSelectorPopupIsVisible,
// } from '../../ducks';
// import {
// 	toggleTestnetPopup,
// 	toggleFeedbackPopup,
// 	toggleWalkthroughPopup,
// 	changeScreen,
// 	changeExchangeMode,
// 	toggleWalletSelectorPopup,
// } from '../../ducks/ui';

// import WalletAddressBox from '../wallet-address-box';
// import styles from './header.module.scss';

// class Header extends Component {
// 	constructor() {
// 		super();
// 		this.onEnvButtonClick = this.onEnvButtonClick.bind(this);
// 		this.onFeedbackButtonClick = this.onFeedbackButtonClick.bind(this);
// 		this.onWalkthroughButtonClick = this.onWalkthroughButtonClick.bind(this);
// 		this.onPageButtonClick = this.onPageButtonClick.bind(this);
// 		this.connectWallet = this.connectWallet.bind(this);
// 		this.switchExchangeMode = this.switchExchangeMode.bind(this);
// 	}

// 	onEnvButtonClick() {
// 		const { toggleTestnetPopup, testnetPopupIsVisible, currentWalletInfo } = this.props;
// 		if (!currentWalletInfo.networkId || currentWalletInfo.networkId === '1') return;
// 		toggleTestnetPopup(!testnetPopupIsVisible);
// 	}

// 	onFeedbackButtonClick() {
// 		const { toggleFeedbackPopup } = this.props;
// 		toggleFeedbackPopup(true);
// 	}

// 	onWalkthroughButtonClick() {
// 		const { toggleWalkthroughPopup } = this.props;
// 		toggleWalkthroughPopup(true);
// 	}

// 	onPageButtonClick(screen) {
// 		return () => {
// 			const { changeScreen } = this.props;
// 			changeScreen(screen);
// 		};
// 	}

// 	connectWallet() {
// 		const { toggleWalletSelectorPopup, walletSelectorPopupIsVisible } = this.props;
// 		toggleWalletSelectorPopup(!walletSelectorPopupIsVisible);
// 	}

// 	renderNetworkName() {
// 		const { currentWalletInfo } = this.props;
// 		switch (currentWalletInfo.networkId) {
// 			case '1':
// 				return 'MAINNET';
// 			case '3':
// 				return 'ROPSTEN';
// 			case '42':
// 				return 'KOVAN';
// 			default:
// 				return 'MAINNET';
// 		}
// 	}

// 	switchExchangeMode() {
// 		const { currentExchangeMode, changeExchangeMode } = this.props;
// 		const newMode = currentExchangeMode === 'basic' ? 'pro' : 'basic';
// 		changeExchangeMode(newMode);
// 	}

// 	renderExchangeButton() {
// 		const { currentExchangeMode, currentScreen } = this.props;
// 		return currentScreen === 'exchange' ? (
// 			<button onClick={this.switchExchangeMode} className={styles.headerButton}>{`${
// 				currentExchangeMode === 'basic' ? 'Pro' : 'Basic'
// 			} Mode`}</button>
// 		) : (
// 			<button onClick={this.onPageButtonClick('exchange')} className={styles.headerButton}>
// 				Exchange
// 			</button>
// 		);
// 	}

// 	render() {
// 		const { currentWalletInfo } = this.props;
// 		const { selectedWallet } = currentWalletInfo;
// 		return (
// 			<div className={styles.header}>
// 				<div className={styles.logoWrapper}>
// 					<img height="36" alt="logo" src="/images/synthetix-logo.svg" />
// 					<button type="button" onClick={this.onEnvButtonClick} className={styles.envButton}>
// 						{this.renderNetworkName()}
// 					</button>
// 					{this.renderExchangeButton()}
// 				</div>
// 				<div className={styles.headerRightArea}>
// 					{/* <button */}
// 					{/*   className={styles.headerButton} */}
// 					{/*   onClick={this.onPageButtonClick('tradingComp')} */}
// 					{/* > */}
// 					{/*   Trading Comp */}
// 					{/* </button> */}
// 					<button className={styles.headerButton} onClick={this.onPageButtonClick('markets')}>
// 						Markets
// 					</button>
// 					<button className={styles.headerButton} onClick={this.onPageButtonClick('transactions')}>
// 						Transactions
// 					</button>
// 					{selectedWallet ? (
// 						<button
// 							onClick={this.onPageButtonClick('connectToWallet')}
// 							className={styles.headerButton}
// 						>
// 							Wallets
// 						</button>
// 					) : null}
// 					{selectedWallet ? (
// 						<WalletAddressBox wallet={selectedWallet} network={currentWalletInfo.networkId} />
// 					) : (
// 						<button className={styles.walletConnectorButton} onClick={this.connectWallet}>
// 							Connect Wallet
// 						</button>
// 					)}
// 				</div>
// 			</div>
// 		);
// 	}
// }

// const mapStateToProps = state => {
// 	return {
// 		currentWalletInfo: getCurrentWalletInfo(state),
// 		testnetPopupIsVisible: testnetPopupIsVisible(state),
// 		currentScreen: getCurrentScreen(state),
// 		currentExchangeMode: getCurrentExchangeMode(state),
// 		walletSelectorPopupIsVisible: walletSelectorPopupIsVisible(state),
// 	};
// };

// const mapDispatchToProps = {
// 	toggleTestnetPopup,
// 	toggleFeedbackPopup,
// 	toggleWalkthroughPopup,
// 	toggleWalletSelectorPopup,
// 	changeScreen,
// 	changeExchangeMode,
// };

// Header.propTypes = {
// 	currentWalletInfo: PropTypes.object.isRequired,
// 	testnetPopupIsVisible: PropTypes.bool.isRequired,
// 	toggleTestnetPopup: PropTypes.func.isRequired,
// 	toggleFeedbackPopup: PropTypes.func.isRequired,
// 	toggleWalkthroughPopup: PropTypes.func.isRequired,
// 	changeScreen: PropTypes.func.isRequired,
// 	changeExchangeMode: PropTypes.func.isRequired,
// 	currentScreen: PropTypes.string.isRequired,
// 	currentExchangeMode: PropTypes.string.isRequired,
// 	walletSelectorPopupIsVisible: PropTypes.bool.isRequired,
// 	toggleWalletSelectorPopup: PropTypes.func.isRequired,
// };

// export default connect(mapStateToProps, mapDispatchToProps)(Header);
