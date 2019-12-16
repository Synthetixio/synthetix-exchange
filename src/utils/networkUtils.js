import throttle from 'lodash/throttle';
import snxJSConnector from './snxJSConnector';

export const GWEI_UNIT = 1000000000;

export const SUPPORTED_NETWORKS = {
	1: 'MAINNET',
	3: 'ROPSTEN',
	4: 'RINKEBY',
	42: 'KOVAN',
};

export const DEFAULT_GAS_LIMIT = {
	mint: 2200000,
	burn: 2200000,
	claim: 1400000,
	exchange: 220000,
	sendSNX: 120000,
	sendEth: 21000,
	sendSynth: 150000,
};

const INFURA_PROJECT_ID = process.env.REACT_APP_INFURA_PROJECT_ID;

export const INFURA_JSON_RPC_URLS = {
	1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
	3: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
	4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
	42: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
};

export const SUPPORTED_WALLETS = ['Metamask', 'Trezor', 'Ledger'];

export const hasWeb3 = () => {
	return window.web3;
};

export async function getEthereumNetwork() {
	return await new Promise(function(resolve, reject) {
		if (!window.web3) resolve({ name: 'MAINNET', networkId: '1' });
		window.web3.version.getNetwork((err, networkId) => {
			if (err) {
				reject(err);
			} else {
				const name = SUPPORTED_NETWORKS[networkId];
				resolve({ name, networkId });
			}
		});
	});
}

export const getTransactionPrice = (gasPrice, gasLimit, ethPrice) => {
	if (!gasPrice || !gasLimit || !ethPrice) return 0;
	return (gasPrice * ethPrice * gasLimit) / GWEI_UNIT;
};

export const getGasInfo = async () => {
	const results = await Promise.all([
		fetch('https://ethgasstation.info/json/ethgasAPI.json'),
		snxJSConnector.snxJS.Synthetix.gasPriceLimit(),
	]);
	const networkInfo = await results[0].json();
	const gasPriceLimit = Number(snxJSConnector.ethersUtils.formatUnits(results[1], 'gwei'));

	const fast = networkInfo.fast / 10;
	const average = networkInfo.average / 10;
	const slow = networkInfo.safeLow / 10;

	const fastestAllowed = gasPriceLimit;
	const averageAllowed = Math.min(average, gasPriceLimit);
	const slowAllowed = Math.min(slow, gasPriceLimit);

	return {
		fastestAllowed,
		averageAllowed,
		slowAllowed,
		fast,
		average,
		slow,
	};
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
