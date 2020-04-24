import throttle from 'lodash/throttle';
import invert from 'lodash/invert';

export const GWEI_UNIT = 1000000000;

export const SUPPORTED_NETWORKS = {
	1: 'MAINNET',
	3: 'ROPSTEN',
	4: 'RINKEBY',
	42: 'KOVAN',
};

export const SUPPORTED_NETWORKS_MAP = invert(SUPPORTED_NETWORKS);

export const DEFAULT_GAS_LIMIT = {
	mint: 2200000,
	burn: 2200000,
	claim: 1400000,
	exchange: 220000,
	sendSNX: 120000,
	sendEth: 21000,
	sendSynth: 150000,
};

export const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const INFURA_JSON_RPC_URLS = {
	1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
	3: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
	4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
	42: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
};

export const SUPPORTED_WALLETS_MAP = {
	METAMASK: 'Metamask',
	TREZOR: 'Trezor',
	LEDGER: 'Ledger',
	COINBASE: 'Coinbase',
	WALLET_CONNECT: 'WalletConnect',
};
export const SUPPORTED_WALLETS = Object.values(SUPPORTED_WALLETS_MAP);

export const hasWeb3 = () => {
	return window.web3;
};

export const defaultNetwork = { name: 'MAINNET', networkId: '1' };

export async function getEthereumNetwork() {
	return await new Promise(function (resolve) {
		if (!window.ethereum) resolve(defaultNetwork);
		const networkId = window.ethereum.networkVersion;
		const name = SUPPORTED_NETWORKS[parseInt(networkId)];
		resolve(networkId && name ? { name, networkId } : defaultNetwork);
	});
}

export const getTransactionPrice = (gasPrice, gasLimit, ethPrice) => {
	if (!gasPrice || !gasLimit || !ethPrice) return 0;
	return (gasPrice * ethPrice * gasLimit) / GWEI_UNIT;
};

const getPriceLimit = (networkInfo, gasPriceLimit) => {
	const fast = networkInfo.fast / 10;
	const average = networkInfo.average / 10;
	const slow = networkInfo.safeLow / 10;

	const speed = {
		fast,
		average,
		slow,
	};

	if (gasPriceLimit) {
		return {
			...speed,
			fastestAllowed: gasPriceLimit,
			averageAllowed: Math.min(average, gasPriceLimit),
			slowAllowed: Math.min(slow, gasPriceLimit),
		};
	}
	return {
		...speed,
		fastestAllowed: fast,
		averageAllowed: average,
		slowAllowed: slow,
	};
};

export const getGasInfo = async () => {
	try {
		const results = await fetch('https://ethgasstation.info/json/ethgasAPI.json');
		const networkInfo = await results.json();
		return getPriceLimit(networkInfo, 0);
	} catch (e) {
		console.log('Error while getting gas info', e);
	}
};

export function onMetamaskAccountChange(cb) {
	if (!window.ethereum) return;
	const listener = throttle(cb, 1000);
	window.ethereum.on('accountsChanged', listener);
}

export function onMetamaskNetworkChange(cb) {
	if (!window.ethereum) return;
	const listener = throttle(cb, 1000);
	window.ethereum.on('networkChanged', listener);
}

export const isMainNet = networkId => networkId === SUPPORTED_NETWORKS_MAP.MAINNET;
