const INFURA_PROJECT_ID =
  process.env.NODE_ENV === 'development'
    ? '5d18f48c9ee0457e9ac5d487d67bc84c'
    : '8c6bfe963db94518b16b17114e29e628';

export const INFURA_JSON_RPC_URLS = {
  1: `https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
  3: `https://ropsten.infura.io/v3/${INFURA_PROJECT_ID}`,
  4: `https://rinkeby.infura.io/v3/${INFURA_PROJECT_ID}`,
  42: `https://kovan.infura.io/v3/${INFURA_PROJECT_ID}`,
};
