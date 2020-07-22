import React, { FC, useContext, useEffect, useMemo } from 'react';
import { ConnectedProps, connect } from 'react-redux';
import styled, { ThemeContext } from 'styled-components';
import { AreaChart, XAxis, YAxis, Area, Tooltip } from 'recharts';
import format from 'date-fns/format';
import { useTranslation } from 'react-i18next';
import isNumber from 'lodash/isNumber';
import find from 'lodash/find';

import RechartsResponsiveContainer from 'components/RechartsResponsiveContainer';

import { DataLarge } from 'components/Typography';
import Spinner from 'components/Spinner';

import useInterval from 'shared/hooks/useInterval';
import { formatCurrencyWithSign } from 'utils/formatters';

import { RootState } from 'ducks/types';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';
import { fetchMyTradesRequest, getMyTrades } from 'ducks/trades/myTrades';
import { HistoricalTrade } from 'ducks/trades/types';
import { SynthPair, getAvailableSynthsMap } from 'ducks/synths';
import { PeriodLabel, PERIOD_IN_HOURS } from 'constants/period';
import { DEFAULT_REQUEST_REFRESH_INTERVAL } from 'constants/ui';
import { getMarketPairByMC } from 'constants/currency';

import { ChartData } from './types';

const mapStateToProps = (state: RootState) => ({
	synthsMap: getAvailableSynthsMap(state),
	trades: getMyTrades(state),
	isWalletConnected: getIsWalletConnected(state),
});

const mapDispatchToProps = {
	fetchMyTradesRequest,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type ChartProps = PropsFromRedux & {
	data: ChartData;
	isLoading: boolean;
	period: PeriodLabel;
	synthPair: SynthPair;
	showTrades: boolean;
};

const Chart: FC<ChartProps> = ({
	isWalletConnected,
	fetchMyTradesRequest,
	trades,
	synthPair: { quote },
	data,
	isLoading,
	period,
	synthsMap,
	showTrades,
}) => {
	const { colors } = useContext(ThemeContext);
	const { t } = useTranslation();
	const synthSign = synthsMap[quote.name] && synthsMap[quote.name].sign;

	useEffect(() => {
		if (isWalletConnected && showTrades) {
			fetchMyTradesRequest();
		}
	}, [isWalletConnected, showTrades, fetchMyTradesRequest]);

	const intervalOrNull = isWalletConnected && showTrades ? DEFAULT_REQUEST_REFRESH_INTERVAL : null;

	useInterval(() => {
		fetchMyTradesRequest();
	}, intervalOrNull);

	const ratesLength = (data?.rates ?? []).length;
	const tradesLength = (trades ?? []).length;

	const dataWithTrades = useMemo(() => {
		if (tradesLength > 0 && ratesLength > 0 && isWalletConnected && showTrades) {
			const newRates = data.rates.map((rate, index) => {
				const trade = find(
					trades,
					(trade: HistoricalTrade) =>
						rate.block < trade.block &&
						index < data.rates.length - 1 &&
						data.rates[index + 1].block > trade.block
				);

				return trade
					? {
							...rate,
							trade,
					  }
					: rate;
			});

			return {
				...data,
				rates: newRates,
			};
		}
		return data;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ratesLength, tradesLength, isWalletConnected, showTrades]);

	const CustomizedDot = ({
		cx,
		cy,
		payload,
	}: {
		cx: number;
		cy: number;
		payload: {
			trade?: HistoricalTrade;
		};
	}) => {
		if ((payload.trade?.fromAmount ?? 0) > 0) {
			const { fromCurrencyKey, toCurrencyKey } = payload.trade as HistoricalTrade;
			const marketPair = getMarketPairByMC(fromCurrencyKey, toCurrencyKey);
			console.log('marketPair', marketPair);
			console.log('toCurrencyKey', toCurrencyKey);
			const color = marketPair.base.startsWith(toCurrencyKey) ? colors.green : colors.red;
			console.log(
				'marketPair.base.startsWith(toCurrencyKey)',
				marketPair.base.startsWith(toCurrencyKey)
			);
			return (
				<svg x={cx - 5} y={cy - 5} width="6" height="15" viewBox="0 0 6 15" fill="none">
					<rect width="6" height="15" rx="1" fill={color} />
				</svg>
			);
		}

		return null;
	};

	const CustomTooltip = ({
		active,
		label,
		payload,
	}: {
		active: boolean;
		payload: [
			{
				value: number;
				payload: {
					trade?: HistoricalTrade;
				};
			}
		];
		label: Date;
	}) => {
		if (active) {
			const { value, payload: innerPayload } = payload[0];
			return (
				<TooltipContentStyle>
					<LabelStyle>{format(label, 'do MMM yy | HH:mm')}</LabelStyle>
					<ItemStyle>{`${t('trade.chart-tooltip.price')}: ${formatCurrencyWithSign(
						synthSign,
						value
					)}`}</ItemStyle>
					{(innerPayload.trade?.fromAmount ?? 0) > 0 ? (
						<>
							<ItemStyle>{`
							  ${t('trade.chart-tooltip.trade')}: ${(innerPayload.trade as HistoricalTrade).fromCurrencyKey}/${
								(innerPayload.trade as HistoricalTrade).toCurrencyKey
							}`}</ItemStyle>
							<ItemStyle>{`${t('trade.chart-tooltip.trade-total')}: ${formatCurrencyWithSign(
								synthSign,
								(innerPayload.trade as HistoricalTrade).fromAmountInUSD
							)}`}</ItemStyle>
						</>
					) : null}
				</TooltipContentStyle>
			);
		}

		return null;
	};

	return (
		<ChartContainer>
			{isLoading ? <Spinner size="sm" /> : null}
			{!isLoading && data.rates.length === 0 ? (
				<DataLarge>{t('common.chart.no-data-available')}</DataLarge>
			) : null}
			{!isLoading && dataWithTrades.rates && dataWithTrades.rates.length > 0 ? (
				<RechartsResponsiveContainer width="100%" height={250}>
					<AreaChart
						data={dataWithTrades.rates}
						margin={{ top: 0, right: -6, left: 10, bottom: 0 }}
					>
						<defs>
							<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={colors.hyperlink} stopOpacity={0.5} />
								<stop offset="95%" stopColor={colors.hyperlink} stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis
							tick={{ fontSize: '9px', fill: colors.fontTertiary }}
							dataKey="timestamp"
							tickFormatter={(val) => {
								if (!isNumber(val)) {
									return '';
								}
								return period.value > PERIOD_IN_HOURS.ONE_DAY
									? format(val, 'dd MMM')
									: format(val, 'h:mma');
							}}
							axisLine={false}
							tickLine={false}
						/>
						<YAxis
							type="number"
							domain={['auto', 'auto']}
							tickFormatter={(val) => `${formatCurrencyWithSign(synthSign, val)}`}
							tick={{ fontSize: '9px', fill: colors.fontTertiary }}
							orientation="right"
							axisLine={false}
							tickLine={false}
						/>
						<Area
							dataKey="rate"
							stroke={colors.hyperlink}
							fillOpacity={0.5}
							fill="url(#colorUv)"
							// @ts-ignore
							dot={<CustomizedDot />}
						/>
						<Tooltip
							content={
								// @ts-ignore
								<CustomTooltip />
							}
						/>
					</AreaChart>
				</RechartsResponsiveContainer>
			) : null}
		</ChartContainer>
	);
};

const ChartContainer = styled.div`
	width: 100%;
	height: 250px;
	display: flex;
	justify-content: center;
	align-items: center;
	.recharts-yAxis .yAxis,
	.recharts-xAxis .xAxis {
		display: none;
	}
`;

const TooltipContentStyle = styled.div`
	padding: 5px;
	border-radius: 4px;
	background-color: ${(props) => props.theme.colors.accentL1};
	text-align: center;
`;

const ItemStyle = styled.div`
	color: ${(props) => props.theme.colors.fontPrimary};
	font-size: 12px;
	padding: 3px 5px;
`;

const LabelStyle = styled(ItemStyle)`
	text-transform: capitalize;
`;

export default connector(Chart);
