import React, { memo, FC, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { FIAT_CURRENCY_MAP } from 'constants/currency';

import { GridDivCenteredCol, TextButton } from 'shared/commonStyles';

import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';

import Card from 'components/Card';
import { PeriodLabel, PERIOD_LABELS_MAP, PERIOD_LABELS } from 'constants/period';
import { Button } from 'components/Button';
import Currency from 'components/Currency';

import { useMarketContext } from '../contexts/MarketContext';
import PriceChart from './PriceChart';
import OptionsChart from './OptionsChart';

type ChartType = 'price' | 'options';

type ChartCardProps = {
	onViewMarketDetails: () => void;
};

const ChartCard: FC<ChartCardProps> = memo(({ onViewMarketDetails }) => {
	const [selectedPeriod, setSelectedPeriod] = useState<PeriodLabel>(PERIOD_LABELS_MAP.ONE_DAY);
	const [chartType, setChartType] = useState<ChartType>('price');

	const optionsMarket = useMarketContext();

	const { t } = useTranslation();

	const chartProps = {
		optionsMarket,
		selectedPeriod,
	};

	return (
		<Card>
			<CardHeader>
				<CardHeaderLeft>
					<Currency.Pair
						baseCurrencyKey={optionsMarket.currencyKey}
						baseCurrencyAsset={optionsMarket.asset}
						quoteCurrencyKey={FIAT_CURRENCY_MAP.USD}
						iconProps={{
							type: 'asset',
						}}
					/>
					<ViewMarketDetailsButton onClick={onViewMarketDetails}>
						{t('options.market.chart-card.view-market-details')} <ArrowHyperlinkIcon />
					</ViewMarketDetailsButton>
				</CardHeaderLeft>
				<CardHeaderRight>
					<Overlays>
						<OverlayButton isActive={chartType === 'price'} onClick={() => setChartType('price')}>
							{t('options.market.chart-card.chart-types.price')}
						</OverlayButton>
						<OverlayButton
							isActive={chartType === 'options'}
							onClick={() => setChartType('options')}
						>
							{t('options.market.chart-card.chart-types.options')}
						</OverlayButton>
					</Overlays>
					<VerticalSeparator />
					<Periods>
						{PERIOD_LABELS.map((period) => (
							<StyledButton
								key={period.value}
								isActive={period.value === selectedPeriod.value}
								onClick={() => setSelectedPeriod(period)}
							>
								{t(period.i18nLabel)}
							</StyledButton>
						))}
					</Periods>
				</CardHeaderRight>
			</CardHeader>
			<Card.Body>
				{chartType === 'price' && <PriceChart {...chartProps} />}
				{chartType === 'options' && <OptionsChart {...chartProps} />}
			</Card.Body>
		</Card>
	);
});

const CardHeader = styled(Card.Header)`
	padding: 0 12px;
	justify-content: space-between;
	> * + * {
		margin-left: 0;
	}
`;

const CardHeaderRight = styled(GridDivCenteredCol)`
	grid-gap: 16px;
`;

const Periods = styled(GridDivCenteredCol)`
	grid-gap: 8px;
`;

const Overlays = styled(GridDivCenteredCol)`
	grid-gap: 8px;
`;

const VerticalSeparator = styled.div`
	height: 24px;
	background-color: ${(props) => props.theme.colors.accentL2};
	width: 1px;
`;

const StyledButton = styled(Button).attrs({
	size: 'xs',
	palette: 'secondary',
})``;

const OverlayButton = styled(StyledButton)`
	text-transform: uppercase;
	display: flex;
	align-items: center;
`;

const CardHeaderLeft = styled(GridDivCenteredCol)`
	grid-gap: 12px;
`;

const ViewMarketDetailsButton = styled(TextButton)`
	cursor: pointer;
	color: ${(props) => props.theme.colors.hyperlink};
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 10.5px;
	svg {
		margin-left: 3px;
		width: 6px;
		height: 6px;
	}
`;

export default ChartCard;
