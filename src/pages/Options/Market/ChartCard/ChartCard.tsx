import React, { memo, FC, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { FIAT_CURRENCY_MAP, USD_SIGN } from 'constants/currency';

import { GridDivCenteredCol, VerticalCardSeparator } from 'shared/commonStyles';

import { ReactComponent as OptionsLineIcon } from 'assets/images/options-line.svg';
import { ReactComponent as DollarSignIcon } from 'assets/images/dollar-sign.svg';

import { formatCurrencyWithSign } from 'utils/formatters';

import Card from 'components/Card';
import { PeriodLabel, PERIOD_LABELS_MAP, PERIOD_LABELS } from 'constants/period';
import { Button } from 'components/Button';
import Currency from 'components/Currency';
import { sectionTitleCSS } from 'components/Typography/General';

import { useMarketContext } from '../contexts/MarketContext';
import PriceChart from './PriceChart';
import OptionsChart from './OptionsChart';

type ChartType = 'price' | 'options';

const ChartCard: FC = memo(() => {
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
					<VerticalCardSeparator />
					<Price>{formatCurrencyWithSign(USD_SIGN, optionsMarket.currentPrice)}</Price>
				</CardHeaderLeft>
				<CardHeaderRight>
					<Overlays>
						<OverlayButton isActive={chartType === 'price'} onClick={() => setChartType('price')}>
							<DollarSignIcon /> {t('options.market.chart-card.chart-types.price')}
						</OverlayButton>
						<OverlayButton
							isActive={chartType === 'options'}
							onClick={() => setChartType('options')}
						>
							<OptionsLineIcon /> {t('options.market.chart-card.chart-types.options')}
						</OverlayButton>
					</Overlays>
					<VerticalCardSeparator />
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

const StyledButton = styled(Button).attrs({
	size: 'xs',
	palette: 'secondary',
})``;

const OverlayButton = styled(StyledButton)`
	text-transform: uppercase;
	display: flex;
	align-items: center;
	svg {
		margin-right: 6px;
	}
`;

const CardHeaderLeft = styled(GridDivCenteredCol)`
	grid-gap: 12px;
`;

const Price = styled.div`
	${sectionTitleCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
`;

export default ChartCard;
