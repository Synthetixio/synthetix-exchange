import throttle from 'lodash/throttle';

export const SUPPORTED_NETWORKS = {
  1: 'MAINNET',
  3: 'ROPSTEN',
  4: 'RINKEBY',
  42: 'KOVAN',
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

export function registerMetamaskAddressListener(cb) {
  if (!window.ethereum) {
    return;
  }
  const listener = throttle(cb, 1000);
  window.ethereum.publicConfigStore.on('update', listener);
}
