import { SUPPORTED_NETWORKS, isMainNet } from '../utils/networkUtils';

const getEtherScanBaseURL = networkId => {
	const network = SUPPORTED_NETWORKS[networkId];

	if (isMainNet(networkId) || network == null) {
		return 'https://etherscan.io';
	}

	return `https://${network.toLowerCase()}.etherscan.io`;
};

export const getEtherscanTxLink = (networkId, txId) => {
	const baseURL = getEtherScanBaseURL(networkId);

	return `${baseURL}/tx/${txId}`;
};

export const getEtherscanAddressLink = (networkId, address) => {
	const baseURL = getEtherScanBaseURL(networkId);

	return `${baseURL}/address/${address}`;
};
