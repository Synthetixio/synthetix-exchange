const SYNTHETIX_API_URL =
  process.env.API_URL || 'https://staging.api.synthetix.io/api/';

export const getTransactions = async wallet => {
  const uri = `${SYNTHETIX_API_URL}blockchainEvents/SynthExchange/${
    wallet ? wallet : ''
  }`;
  const results = await fetch(uri);
  return results.json();
};
