import synthetixJsTools from '../synthetixJsTool';

export const DEFAULT_GAS_LIMIT = 600000;
export const DEFAULT_GAS_PRICE = 4000000000;
export const GWEI = 1000000000;

export const getGasAndSpeedInfo = async () => {
  const convetorTxGasPrice = DEFAULT_GAS_LIMIT;
  let [egsData, ethPrice, gasPriceLimit] = await Promise.all([
    fetch('https://ethgasstation.info/json/ethgasAPI.json'),
    synthetixJsTools.synthetixJs.Depot.usdToEthPrice(),
    synthetixJsTools.synthetixJs.Synthetix.gasPriceLimit(),
  ]);
  egsData = await egsData.json();
  ethPrice = Number(synthetixJsTools.utils.formatEther(ethPrice));
  gasPriceLimit = synthetixJsTools.ethersUtils.formatUnits(
    gasPriceLimit,
    'gwei'
  );
  return {
    gasPriceLimit,
    fast: {
      gwei: Math.min(egsData.fast / 10, gasPriceLimit),
      price:
        Math.round(
          (((egsData.fast / 10) * ethPrice * convetorTxGasPrice) / GWEI) * 1000
        ) / 1000,
    },
    average: {
      gwei: egsData.average / 10,
      price:
        Math.round(
          (((egsData.average / 10) * ethPrice * convetorTxGasPrice) / GWEI) *
            1000
        ) / 1000,
    },
    slow: {
      gwei: egsData.safeLow / 10,
      price:
        Math.round(
          (((egsData.safeLow / 10) * ethPrice * convetorTxGasPrice) / GWEI) *
            1000
        ) / 1000,
    },
  };
};
