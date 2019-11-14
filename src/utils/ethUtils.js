import synthetixJsTools from '../synthetixJsTool';

export const DEFAULT_GAS_LIMIT = 600000;
export const DEFAULT_GAS_PRICE = 4000000000;
export const GWEI = 1000000000;

const getTransactionPrice = (gwei, ethPrice) => {
	return Math.round(((gwei * ethPrice * DEFAULT_GAS_LIMIT) / GWEI) * 1000) / 1000;
};

export const getGasAndSpeedInfo = async () => {
	let [egsData, ethPrice, gasPriceLimit] = await Promise.all([
		fetch('https://ethgasstation.info/json/ethgasAPI.json'),
		synthetixJsTools.synthetixJs.Depot.usdToEthPrice(),
		synthetixJsTools.synthetixJs.Synthetix.gasPriceLimit(),
	]);
	egsData = await egsData.json();
	ethPrice = Number(synthetixJsTools.utils.formatEther(ethPrice));
	gasPriceLimit = Number(synthetixJsTools.ethersUtils.formatUnits(gasPriceLimit, 'gwei'));

	const fastGwei = egsData.fast / 10;
	const averageGwei = egsData.average / 10;
	const slowGwei = egsData.safeLow / 10;

	return {
		fastestAllowed: {
			gwei: gasPriceLimit,
			price: getTransactionPrice(gasPriceLimit, ethPrice),
		},
		averageAllowed: {
			gwei: Math.min(averageGwei, gasPriceLimit),
			price: getTransactionPrice(Math.min(averageGwei, gasPriceLimit), ethPrice),
		},
		slowAllowed: {
			gwei: Math.min(slowGwei, gasPriceLimit),
			price: getTransactionPrice(Math.min(slowGwei, gasPriceLimit), ethPrice),
		},
		fast: {
			gwei: fastGwei,
			price: getTransactionPrice(fastGwei, ethPrice),
		},
		average: {
			gwei: averageGwei,
			price: getTransactionPrice(averageGwei, ethPrice),
		},
		slow: {
			gwei: slowGwei,
			price: getTransactionPrice(slowGwei, ethPrice),
		},
	};
};
