const SYNTHETIX_API_URL =
  process.env.API_URL ||
  'http://havven-api-staging.ap-southeast-2.elasticbeanstalk.com/api/';

export const getTransactions = async wallet => {
  const uri = `${SYNTHETIX_API_URL}blockchainEvents/SynthExchange/${
    wallet ? wallet : ''
  }`;
  const results = await fetch(uri);
  return results.json();
};
