import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { getSynthPair, getAvailableSynthsMap } from 'src/ducks/synths';
import { getRatesExchangeRates } from 'src/ducks/rates';

import { InfoBox, InfoBoxLabel, InfoBoxValue } from 'src/shared/commonStyles';
import {
	formatCurrencyWithPrecision,
	formatCurrency,
	formatCurrencyWithSign,
} from 'src/utils/formatters';
import { getExchangeRatesForCurrencies } from 'src/utils/rates';

import ChangePercent from 'src/components/ChangePercent';

const InfoRow = ({
	data: { low24H, high24H, change24H, volume24H },
	exchangeRates,
	synthPair: { base, quote },
	synthsMap,
}) => {
	const { t } = useTranslation();
	const rate = getExchangeRatesForCurrencies(exchangeRates, base.name, quote.name) || 0;
	const synthSign = synthsMap[quote.name] && synthsMap[quote.name].sign;

	const infoBoxItems = [
		{
			label: t('trade.chart-card.info-boxes.price'),
			value: formatCurrencyWithPrecision(rate),
		},
		{
			label: t('trade.chart-card.info-boxes.24h-change'),
			value: <ChangePercent value={change24H} />,
		},
		{
			label: t('trade.chart-card.info-boxes.24h-high'),
			value: formatCurrencyWithSign(synthSign, high24H),
		},
		{
			label: t('trade.chart-card.info-boxes.24h-low'),
			value: formatCurrencyWithSign(synthSign, low24H),
		},
		{
			label: t('trade.chart-card.info-boxes.24h-volume'),
			value: formatCurrency(volume24H),
		},
	];
	return (
		<RowContainer>
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

const mapStateToProps = state => ({
	synthPair: getSynthPair(state),
	exchangeRates: getRatesExchangeRates(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InfoRow);
