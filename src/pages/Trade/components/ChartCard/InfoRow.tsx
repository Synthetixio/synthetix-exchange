import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';

import { USD_SIGN } from 'constants/currency';

import { getAvailableSynthsMap, SynthDefinitionMap, SynthPair } from 'ducks/synths';
import { getRatesExchangeRates, Rates } from 'ducks/rates';
import { RootState } from 'ducks/types';

import { InfoBox, InfoBoxLabel, InfoBoxValue } from 'shared/commonStyles';
import { formatCurrencyWithPrecision, formatCurrencyWithSign } from 'utils/formatters';
import { getExchangeRatesForCurrencies } from 'utils/rates';

import ChangePercent from 'components/ChangePercent';
import { PERIOD_IN_HOURS } from 'constants/period';
import { fetchSynthRateUpdates, fetchSynthVolumeInUSD } from 'services/rates/rates';

import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/ui';

type StateProps = {
	exchangeRates: Rates | null;
	synthsMap: SynthDefinitionMap;
};

type Props = {
	synthPair: SynthPair;
};

type InfoRowProps = StateProps & Props;

const InfoRow: FC<InfoRowProps> = ({ exchangeRates, synthPair: { base, quote }, synthsMap }) => {
	const { t } = useTranslation();
	const rate = getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name) || 0;
	const synthSign = synthsMap[quote.name] && synthsMap[quote.name].sign;
	const [prevRate, setPrevRate] = useState<number>(rate);
	const [rateChange, setRateChange] = useState<number>(0);

	const vol24HQuery = useQuery(
		['historicalVolume', base.name, quote.name, PERIOD_IN_HOURS.ONE_DAY],
		async () => {
			const totalVolume = await fetchSynthVolumeInUSD(
				base.name,
				quote.name,
				PERIOD_IN_HOURS.ONE_DAY
			);
			return totalVolume;
		},
		{
			refetchInterval: DEFAULT_REQUEST_REFRESH_INTERVAL,
		}
	);

	const rates24HQuery = useQuery(
		['historicalTrades', base.name, quote.name, PERIOD_IN_HOURS.ONE_DAY],
		async () => {
			const rates = await fetchSynthRateUpdates(base.name, quote.name, PERIOD_IN_HOURS.ONE_DAY);
			return rates;
		},
		{
			refetchInterval: DEFAULT_REQUEST_REFRESH_INTERVAL,
		}
	);

	useEffect(() => {
		if (rate > 0 && prevRate > 0) {
			if (rate > prevRate) {
				setRateChange(1);
			} else if (rate < prevRate) {
				setRateChange(-1);
			} else {
				setRateChange(0);
			}
		}
		setPrevRate(rate);
		// eslint-disable-next-line
	}, [rate]);

	useEffect(() => {
		setPrevRate(rate);
		setRateChange(0);
		// eslint-disable-next-line
	}, [base.name, quote.name]);

	const infoBoxItems = [
		{
			label: t('trade.chart-card.info-boxes.24h-change'),
			value: <ChangePercent value={rates24HQuery.data?.change ?? 0} />,
		},
		{
			label: t('trade.chart-card.info-boxes.24h-high'),
			value: formatCurrencyWithSign(synthSign, rates24HQuery.data?.high ?? 0),
		},
		{
			label: t('trade.chart-card.info-boxes.24h-low'),
			value: formatCurrencyWithSign(synthSign, rates24HQuery.data?.low ?? 0),
		},
		{
			label: t('trade.chart-card.info-boxes.24h-volume'),
			value: formatCurrencyWithSign(USD_SIGN, vol24HQuery.data ?? 0),
		},
	];

	return (
		<RowContainer>
			<InfoBox>
				<InfoBoxLabel>{t('trade.chart-card.info-boxes.price')}</InfoBoxLabel>
				<InfoBoxValue rateChange={rateChange}>{`${synthSign}${formatCurrencyWithPrecision(
					rate
				)}`}</InfoBoxValue>
			</InfoBox>
			{infoBoxItems.map(({ label, value }, id) => (
				<InfoBox key={`chartInfo-${id}`}>
					<InfoBoxLabel>{label}</InfoBoxLabel>
					<InfoBoxValue>{value}</InfoBoxValue>
				</InfoBox>
			))}
		</RowContainer>
	);
};

const RowContainer = styled.div`
	margin-top: 2px;
	display: grid;
	grid-column-gap: 12px;
	grid-auto-flow: column;
`;

const mapStateToProps = (state: RootState): StateProps => ({
	exchangeRates: getRatesExchangeRates(state),
	synthsMap: getAvailableSynthsMap(state),
});

export default connect(mapStateToProps)(InfoRow);
