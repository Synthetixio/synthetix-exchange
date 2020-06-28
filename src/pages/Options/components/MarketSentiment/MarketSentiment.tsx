import React, { memo, FC } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import { labelSmallCSS } from 'components/Typography/Label';

import { GridDivCentered, FlexDivRowCentered } from 'shared/commonStyles';
import { formatCurrency } from 'utils/formatters';

type Display = 'row' | 'col';

type MarketSentimentProps = {
	long: number;
	short: number;
	display?: Display;
};

export const MarketSentiment: FC<MarketSentimentProps> = memo(
	({ long, short, display, ...rest }) => {
		const { t } = useTranslation();

		const priceLong = long * 100;
		const priceShort = short * 100;
		const range = priceLong + priceShort;

		const longs = (
			<Longs className="longs">
				{t('common.val-in-cents', { val: formatCurrency(priceLong) })}
			</Longs>
		);
		const shorts = (
			<Shorts className="shorts">
				{t('common.val-in-cents', { val: formatCurrency(priceShort) })}
			</Shorts>
		);

		const longsPercent = (
			<LongsPercent
				className="longs-percent percent"
				style={{ width: `calc(${(priceLong / range) * 100}% - 2px)` }}
			/>
		);
		const shortsPercent = (
			<ShortsPercent
				className="shorts-percent percent"
				style={{ width: `calc(${(priceShort / range) * 100}% - 2px)` }}
			/>
		);
		return (
			<Container display={display} {...rest}>
				{display === 'row' && (
					<>
						<FlexDivRowCentered>
							{longs}
							{shorts}
						</FlexDivRowCentered>
						<FlexDivRowCentered>
							{longsPercent}
							{shortsPercent}
						</FlexDivRowCentered>
					</>
				)}
				{display === 'col' && (
					<>
						{longs}
						<FlexDivRowCentered>
							{longsPercent}
							{shortsPercent}
						</FlexDivRowCentered>
						{shorts}
					</>
				)}
			</Container>
		);
	}
);

MarketSentiment.defaultProps = {
	display: 'row',
};

const Container = styled(GridDivCentered)<{ display?: Display }>`
	${labelSmallCSS};
	grid-gap: 4px;
	> * {
		width: 100%;
	}

	${(props) =>
		props.display === 'col' &&
		css`
			grid-template-columns: auto 1fr auto;
		`}
`;

const Longs = styled.div`
	color: ${(props) => props.theme.colors.green};
`;
const Shorts = styled.div`
	color: ${(props) => props.theme.colors.red};
`;

const LongsPercent = styled.div`
	height: 16px;
	background-color: ${(props) => props.theme.colors.green};
	border-top-left-radius: 2px;
	border-bottom-left-radius: 2px;
`;
const ShortsPercent = styled.div`
	height: 16px;
	background-color: ${(props) => props.theme.colors.red};
	border-top-right-radius: 2px;
	border-bottom-right-radius: 2px;
`;

export default MarketSentiment;
