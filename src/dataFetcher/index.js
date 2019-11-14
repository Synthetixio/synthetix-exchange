import { getGasAndSpeedInfo } from '../utils/ethUtils';
import synthetixJsTools from '../synthetixJsTool';

const getExchangeRates = async synths => {
  if (!synths) return;
  let formattedSynthRates = {};
  try {
    const [synthRates, ethRate] = await Promise.all([
      synthetixJsTools.synthetixJs.ExchangeRates.ratesForCurrencies(
        synths.map(synth => synthetixJsTools.getUtf8Bytes(synth.name))
      ),
      synthetixJsTools.synthetixJs.Depot.usdToEthPrice(),
    ]);
    synthRates.forEach((rate, i) => {
      formattedSynthRates[synths[i].name] = Number(
        synthetixJsTools.synthetixJs.utils.formatEther(rate)
      );
    });
    const formattedEthRate = synthetixJsTools.synthetixJs.utils.formatEther(
      ethRate
    );
    return { synthRates: formattedSynthRates, ethRate: formattedEthRate };
  } catch (e) {
    console.log(e);
  }
};

const getExchangeFeeRate = async () => {
  const { formatEther } = synthetixJsTools.synthetixJs.utils;
  try {
    const exchangeFeeRate = await synthetixJsTools.synthetixJs.FeePool.exchangeFeeRate();
    return 100 * Number(formatEther(exchangeFeeRate));
  } catch (e) {
    console.log(e);
  }
};

const getNetworkPrices = async () => {
  return await getGasAndSpeedInfo();
};

const getFrozenSynths = async synths => {
  let frozenSynths = {};
  const inverseSynths = synths
    .filter(synth => synth.name.charAt(0) === 'i')
    .map(synth => synth.name);
  const results = await Promise.all(
    inverseSynths.map(synth =>
      synthetixJsTools.synthetixJs.ExchangeRates.rateIsFrozen(
        synthetixJsTools.getUtf8Bytes(synth)
      )
    )
  );
  results.forEach((isFrozen, index) => {
    if (isFrozen) frozenSynths[inverseSynths[index]] = true;
  });
  return frozenSynths;
};

export const getExchangeData = async synths => {
  const [
    exchangeRates,
    exchangeFeeRate,
    networkPrices,
    frozenSynths,
  ] = await Promise.all([
    getExchangeRates(synths),
    getExchangeFeeRate(),
    getNetworkPrices(),
    getFrozenSynths(synths),
  ]);
  return {
    exchangeRates,
    exchangeFeeRate,
    networkPrices,
    frozenSynths,
  };
};
