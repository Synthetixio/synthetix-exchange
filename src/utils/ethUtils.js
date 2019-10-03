import synthetixJsTools from '../synthetixJsTool';

export const DEFAULT_GAS_LIMIT = 600000;
export const DEFAULT_GAS_PRICE = 4000000000;
export const GWEI = 1000000000;

export const getGasAndSpeedInfo = async () => {
  const convetorTxGasPrice = DEFAULT_GAS_LIMIT;
  const getGasPriceLimit =
    synthetixJsTools.synthetixJs.Synthetix.gasPriceLimit || (() => {});
  let [egsData, ethPrice, gasPriceLimit] = await Promise.all([
    fetch('https://ethgasstation.info/json/ethgasAPI.json'),
    synthetixJsTools.synthetixJs.Depot.usdToEthPrice(),
    getGasPriceLimit(),
  ]);
  egsData = await egsData.json();
  ethPrice = Number(synthetixJsTools.utils.formatEther(ethPrice));
  gasPriceLimit = gasPriceLimit
    ? synthetixJsTools.ethersUtils.formatUnits(gasPriceLimit, 'gwei')
    : null;
  return {
    gasPriceLimit,
    fast: {
      gwei: gasPriceLimit
        ? Math.min(egsData.fast / 10, gasPriceLimit)
        : egsData.fast / 10,
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
