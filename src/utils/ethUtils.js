import synthetixJsTools from '../synthetixJsTool';

export const DEFAULT_GAS_LIMIT = 600000;
export const DEFAULT_GAS_PRICE = 4000000000;
export const GWEI = 1000000000;

export const getGasAndSpeedInfo = async () => {
  // ethToNomin uses approx 80,000, nominToHav 40,000 but approve 70,000; 100,000 is safe average
  const convetorTxGasPrice = DEFAULT_GAS_LIMIT;
  let [egsData, ethPrice] = await Promise.all([
    fetch('https://ethgasstation.info/json/ethgasAPI.json'),
    await synthetixJsTools.synthetixJs.Depot.usdToEthPrice(),
  ]);
  egsData = await egsData.json();
  ethPrice = Number(synthetixJsTools.utils.formatEther(ethPrice));
  return {
    fast: {
      gwei: egsData.fast / 10,
      time: egsData.fastWait,
      price:
        Math.round(
          (((egsData.fast / 10) * ethPrice * convetorTxGasPrice) / GWEI) * 1000
        ) / 1000,
    },
    average: {
      gwei: egsData.average / 10,
      time: egsData.avgWait,
      price:
        Math.round(
          (((egsData.average / 10) * ethPrice * convetorTxGasPrice) / GWEI) *
            1000
        ) / 1000,
    },
    slow: {
      gwei: egsData.safeLow / 10,
      time: egsData.safeLowWait,
      price:
        Math.round(
          (((egsData.safeLow / 10) * ethPrice * convetorTxGasPrice) / GWEI) *
            1000
        ) / 1000,
    },
  };
};
