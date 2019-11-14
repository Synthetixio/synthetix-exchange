const SYNTHETIX_API_URL_BY_NETWORKS = {
	1: 'https://api.synthetix.io/api/',
	3: 'https://api.synthetix.io/api/',
	42: 'https://kovan.api.synthetix.io/api/',
};

export const getTransactions = async networkId => {
	const apiBaseUri = networkId
		? SYNTHETIX_API_URL_BY_NETWORKS[networkId]
		: SYNTHETIX_API_URL_BY_NETWORKS[1];
	const uri = `${apiBaseUri}blockchainEvents/SynthExchange/`;
	const results = await fetch(uri);
	return results.json();
};
