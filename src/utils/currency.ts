import { currencyKeyToIconMap, CurrencyKey } from 'constants/currency';

const { SynthetixJs } = require('synthetix-js');

interface ICurrencyDetails {
	tokenAddress: string;
	tokenSymbol: string;
	tokenDecimals: number;
	tokenImage: string;
}

export const getCurrencyKeyIcon = (currencyKey: CurrencyKey) => currencyKeyToIconMap[currencyKey];

export const getCurrencyKeyURLPath = (currencyKey: CurrencyKey) =>
	`https:///www.synthetix.io/assets/synths/svg/${currencyKey}.svg`;

export const getCurrencyDetails = async (currencyKey: CurrencyKey): Promise<ICurrencyDetails> => {
	// Uses default setup - can't find anything in synthetix docs to set this to testnet
	const snxjs = new SynthetixJs();
	const tokenAddress = snxjs[currencyKey].contract.address;
	const tokenSymbol = await snxjs[currencyKey].symbol();
	const tokenDecimals = await snxjs[currencyKey].decimals();
	const tokenImage = getCurrencyKeyURLPath(currencyKey);
	return {
		tokenAddress: tokenAddress,
		tokenSymbol: tokenSymbol,
		tokenDecimals: tokenDecimals,
		tokenImage: tokenImage,
	};
};
