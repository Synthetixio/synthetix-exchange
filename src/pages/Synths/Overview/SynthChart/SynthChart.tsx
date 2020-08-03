import React, { FC, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import get from 'lodash/get';
import { useTranslation } from 'react-i18next';

import { SynthDefinition, getSynthsWithRatesMap, SynthDefinitionWithRatesMap } from 'ducks/synths';
import { RootState } from 'ducks/types';
import { fetchHistoricalRatesRequest, HistoricalRatesData } from 'ducks/historicalRates';

import { SYNTHS_MAP, sUSD_EXCHANGE_RATE, USD_SIGN } from 'constants/currency';
import { BaseRateUpdates } from 'constants/rates';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/ui';
import { PeriodLabel, PERIOD_LABELS_MAP } from 'constants/period';

import { ReactComponent as SnowflakeIcon } from 'assets/images/snowflake.svg';
import { formatCurrencyWithSign } from 'utils/formatters';
import { mockRates } from 'pages/Synths/mockData';
import { darkTheme, lightTheme } from 'styles/theme';

import useInterval from 'shared/hooks/useInterval';
import { media } from 'shared/media';
import { GridDivCenteredRow } from 'shared/commonStyles';

import ChartCard from 'components/ChartCard';
import Currency from 'components/Currency';
import { bodyCSS, subtitleSmallCSS } from 'components/Typography/General';

type StateProps = {
	synthsWithRatesMap: SynthDefinitionWithRatesMap;
};

type DispatchProps = {
	fetchHistoricalRatesRequest: typeof fetchHistoricalRatesRequest;
};

type Props = {
	synth: SynthDefinition;
};

type SynthChartProps = StateProps & DispatchProps & Props;

export const SynthChart: FC<SynthChartProps> = ({
	synth,
	fetchHistoricalRatesRequest,
	synthsWithRatesMap,
}) => {
	const { t } = useTranslation();
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.ONE_DAY);
	const [historicalRateUpdates, setHistoricalRatesUpdates] = useState<BaseRateUpdates>([]);
	const [historicalRateChange, setHistoricalRatesChange] = useState<number | null>(0);
	const [loading, setLoading] = useState<boolean>(true);

	const isUSD = synth.name === SYNTHS_MAP.sUSD;

	useEffect(() => {
		if (!isUSD) {
			fetchHistoricalRatesRequest({
				currencyKeys: [synth.name],
				periods: [selectedPeriod.period],
			});
		}
	}, [fetchHistoricalRatesRequest, synth, selectedPeriod.period, isUSD]);

	useInterval(
		() => {
			fetchHistoricalRatesRequest({
				currencyKeys: [synth.name],
				periods: [selectedPeriod.period],
			});
		},
		isUSD ? null : DEFAULT_REQUEST_REFRESH_INTERVAL
	);

	useEffect(() => {
		if (isUSD) {
			const rates = mockRates(selectedPeriod.value, sUSD_EXCHANGE_RATE);

			setLoading(false);
			setHistoricalRatesUpdates(rates);
		} else {
			const historicalRates: HistoricalRatesData | null = get(
				synthsWithRatesMap,
				[synth.name, 'historicalRates', selectedPeriod.period, 'data'],
				null
			);

			if (historicalRates != null) {
				setLoading(false);
				setHistoricalRatesUpdates(historicalRates?.rates || []);
				setHistoricalRatesChange(historicalRates?.change || 0);
			} else {
				setLoading(true);
			}
		}
	}, [synthsWithRatesMap, selectedPeriod, synth.name, isUSD]);

	const lastPrice = get(synthsWithRatesMap, [synth.name, 'lastPrice'], null);
	const synthSign = USD_SIGN;

	return (
		<StyledChartCard
			tooltipVisible={true}
			currencyLabel={
				<Currency.Name
					currencyKey={synth.name}
					showIcon={true}
					iconProps={{ width: '24px', height: '24px' }}
				/>
			}
			price={lastPrice != null ? formatCurrencyWithSign(synthSign, lastPrice) : null}
			change={historicalRateChange}
			chartData={historicalRateUpdates}
			variableGradient={false}
			selectedPeriod={selectedPeriod}
			onPeriodClick={setSelectedPeriod}
			showLoader={loading}
			synthSign={synthSign}
			xAxisVisible={true}
			yAxisDomain={
				synth.inverted ? [synth.inverted.lowerLimit, synth.inverted.upperLimit] : undefined
			}
			yAxisRefLines={
				synth.inverted
					? [
							{
								label: t('common.currency.lower-limit-price', {
									price: `${synthSign}${synth.inverted.lowerLimit}`,
								}),
								value: synth.inverted.lowerLimit,
							},
							{
								label: t('common.currency.entry-limit-price', {
									price: `${synthSign}${synth.inverted.entryPoint}`,
								}),
								value: synth.inverted.entryPoint,
							},
							{
								label: t('common.currency.upper-limit-price', {
									price: `${synthSign}${synth.inverted.upperLimit}`,
								}),
								// TODO: this isn't an optimal solution... the label is cut when its using the true upper limit
								value: synth.inverted.upperLimit * 0.95,
							},
					  ]
					: undefined
			}
			overlayMessage={
				synth.inverted && synth.isFrozen ? (
					<FrozenMessage>
						<SnowflakeIcon />
						<FrozenMessageTitle>{t('common.currency.frozen-synth')}</FrozenMessageTitle>
						<FrozenMessageSubtitle>
							{lastPrice === synth.inverted.lowerLimit
								? t('common.currency.lower-limit-reached-reset')
								: t('common.currency.upper-limit-reached-reset')}
						</FrozenMessageSubtitle>
					</FrozenMessage>
				) : undefined
			}
		/>
	);
};

const FrozenMessage = styled(GridDivCenteredRow)`
	justify-items: center;
	svg {
		color: ${(props) => props.theme.colors.icons};
	}
`;

const FrozenMessageTitle = styled.div`
	${subtitleSmallCSS};
	color: ${lightTheme.colors.fontPrimary};
	padding-top: 5px;
`;

const FrozenMessageSubtitle = styled.div`
	${bodyCSS};
	color: ${darkTheme.colors.accentL2};
`;

const StyledChartCard = styled(ChartCard)`
	height: 450px;
	padding: 0;
	${media.large`
		border-radius: 0;
		height: 340px;
	`}
	.labels-container {
		padding: 24px 24px 0 24px;
	}
	.chart-data {
		padding: 0 24px 24px 24px;
		${media.large`
		padding: 0 0 10px 0;
		`}
	}
	.currency-price,
	.currency-key > * {
		font-size: 24px;
		${media.large`
			font-size: 20px;
		`}
	}
	.currency-key > * {
		color: ${darkTheme.colors.accentL1};
	}
	.change-percent {
		min-width: 60px;
		text-align: center;
	}
	.recharts-default-tooltip {
		background: ${darkTheme.colors.surfaceL1} !important;
	}
	.recharts-tooltip-label,
	.recharts-tooltip-item {
		color: ${darkTheme.colors.white} !important;
	}

	.recharts-reference-line .recharts-label {
		font-size: 10px;
		fill: ${darkTheme.colors.fontTertiary};
		font-family: ${(props) => props.theme.fonts.regular};
		text-transform: uppercase;
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsWithRatesMap: getSynthsWithRatesMap(state),
});

const mapDispatchToProps: DispatchProps = {
	fetchHistoricalRatesRequest,
};

export default connect<StateProps, DispatchProps, Props, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(SynthChart);
