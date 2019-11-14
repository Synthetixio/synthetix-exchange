import React from 'react';
import PropTypes from 'prop-types';

import styles from './wallet-address-box.module.scss';

const ETHERSCAN_URLS = {
	1: 'https://etherscan.io/address/',
	3: 'https://ropsten.etherscan.io/address/',
	42: 'https://kovan.etherscan.io/address/',
};

const shortenAddress = (address, network) => {
	if (!address) return null;
	return (
		<a
			href={`${ETHERSCAN_URLS[network]}${address}`}
			className={styles.addressBoxWallet}
			target="_blank"
		>
			{address.slice(0, 6) + '...' + address.slice(-4, address.length)}
		</a>
	);
};

const WalletAddressBox = ({ wallet, network }) => {
	return (
		<div className={styles.addressBoxWrapper}>
			<div className={`${styles.addressBox} ${styles.addressBoxIsConnected}`}>
				<span className={styles.addressBoxStatus}>
					{wallet ? 'Connected' : 'Wallet not connected'}
				</span>
				{shortenAddress(wallet, network)}
			</div>
		</div>
	);
};

WalletAddressBox.propTypes = {
	wallet: PropTypes.string.isRequired,
	network: PropTypes.string.isRequired,
};

export default WalletAddressBox;
