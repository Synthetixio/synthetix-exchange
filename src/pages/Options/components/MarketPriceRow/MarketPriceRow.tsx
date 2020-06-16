import React, { memo, FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { labelSmallCSS } from 'components/Typography/Label';

import { GridDivCentered, FlexDivRowCentered } from 'shared/commonStyles';

type MarketPriceRowProps = {
	long: number;
	short: number;
};

export const MarketPriceRow: FC<MarketPriceRowProps> = memo(({ long, short, ...rest }) => {
	const { t } = useTranslation();

	return (
		<Container {...rest}>
			<FlexDivRowCentered>
				<Longs>{t('common.val-in-cents', { val: long })}</Longs>
				<Shorts>{t('common.val-in-cents', { val: short })}</Shorts>
			</FlexDivRowCentered>
			<FlexDivRowCentered>
				<LongsPercent style={{ width: `calc(${long}% - 2px)` }} />
				<ShortsPercent style={{ width: `calc(${short}% - 2px)` }} />
			</FlexDivRowCentered>
		</Container>
	);
});

const Container = styled(GridDivCentered)`
	grid-gap: 4px;
	> * {
		width: 100%;
	}
`;

const Longs = styled.div`
	${labelSmallCSS};
	color: ${(props) => props.theme.colors.green};
`;
const Shorts = styled.div`
	${labelSmallCSS};
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

export default MarketPriceRow;
