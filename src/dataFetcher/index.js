import { getGasAndSpeedInfo } from '../utils/ethUtils';
import snxJSConnector from '../utils/snxJSConnector';
import { bytesFormatter, bigNumberFormatter } from '../utils/formatters';

const getExchangeRates = async synths => {
	if (!synths) return;
	let formattedSynthRates = {};
	try {
		const [synthRates, ethRate] = await Promise.all([
			snxJSConnector.snxJS.ExchangeRates.ratesForCurrencies(
				synths.map(synth => bytesFormatter(synth.name))
			),
			snxJSConnector.snxJS.Depot.usdToEthPrice(),
		]);
		synthRates.forEach((rate, i) => {
			formattedSynthRates[synths[i].name] = Number(snxJSConnector.snxJS.utils.formatEther(rate));
		});
		const formattedEthRate = snxJSConnector.snxJS.utils.formatEther(ethRate);
		return { synthRates: formattedSynthRates, ethRate: formattedEthRate };
	} catch (e) {
		console.log(e);
	}
};

const getExchangeFeeRate = async () => {
	const { formatEther } = snxJSConnector.snxJS.utils;
	try {
		const exchangeFeeRate = await snxJSConnector.snxJS.FeePool.exchangeFeeRate();
		return 100 * Number(formatEther(exchangeFeeRate));
	} catch (e) {
		console.log(e);
	}
};

const getNetworkPrices = async () => {
	return await getGasAndSpeedInfo();
};

const getFrozenSynths = async synths => {
	let frozenSynths = {};
	const inverseSynths = synths
		.filter(synth => synth.name.charAt(0) === 'i')
		.map(synth => synth.name);
	const results = await Promise.all(
		inverseSynths.map(synth =>
			snxJSConnector.snxJS.ExchangeRates.rateIsFrozen(bytesFormatter(synth))
		)
	);
	results.forEach((isFrozen, index) => {
		if (isFrozen) frozenSynths[inverseSynths[index]] = true;
	});
	return frozenSynths;
};

export const getExchangeData = async synths => {
	const [exchangeRates, exchangeFeeRate, networkPrices, frozenSynths] = await Promise.all([
		getExchangeRates(synths),
		getExchangeFeeRate(),
		getNetworkPrices(),
		getFrozenSynths(synths),
	]);
	return {
		exchangeRates,
		exchangeFeeRate,
		networkPrices,
		frozenSynths,
	};
};

const getSynthsBalance = async (walletAddress, synths) => {
	const results = await Promise.all(
		synths.map(synth => snxJSConnector.snxJS[synth.name].balanceOf(walletAddress))
	);
	const walletBalances = await Promise.all(
		results.map(async (balance, i) => {
			const usdBalance = await snxJSConnector.snxJS.Synthetix.effectiveValue(
				bytesFormatter(synths[i].name),
				balance,
				bytesFormatter('sUSD')
			);
			return {
				balance: bigNumberFormatter(balance),
				usdBalance: bigNumberFormatter(usdBalance),
			};
		})
	);
	let total = 0;
	let balances = {};
	walletBalances.forEach((balance, i) => {
		const synthName = synths[i].name;
		if (balance.balance > 0) {
			total += balance.usdBalance;
			balances[synthName] = balance;
		}
	});
	return {
		balances,
		total,
	};
};

const getSnxBalance = async walletAddress => {
	const balance = await snxJSConnector.snxJS.Synthetix.collateral(walletAddress);
	const usdBalance = await snxJSConnector.snxJS.Synthetix.effectiveValue(
		bytesFormatter('SNX'),
		balance,
		bytesFormatter('sUSD')
	);
	return {
		balance: bigNumberFormatter(balance),
		usdBalance: bigNumberFormatter(usdBalance),
	};
};

const getEthBalance = async walletAddress => {
	const balance = await snxJSConnector.provider.getBalance(walletAddress);
	const usdBalance = await snxJSConnector.snxJS.Synthetix.effectiveValue(
		bytesFormatter('sETH'),
		balance,
		bytesFormatter('sUSD')
	);
	return {
		balance: bigNumberFormatter(balance),
		usdBalance: bigNumberFormatter(usdBalance),
	};
};

export const getWalletBalances = async (walletAddress, synths) => {
	try {
		const [synthsBalance, snxBalance, ethBalance] = await Promise.all([
			getSynthsBalance(walletAddress, synths),
			getSnxBalance(walletAddress),
			getEthBalance(walletAddress),
		]);
		return { synths: synthsBalance, snx: snxBalance, eth: ethBalance };
	} catch (e) {
		console.log(e);
	}
};
