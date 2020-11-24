import React, { FC } from 'react';
import styled from 'styled-components';

import { labelSmallCSS } from 'components/Typography/Label';

import { GridDivCentered, FlexDivRowCentered, FlexDivCentered } from 'shared/commonStyles';
import { formatPercentage } from 'utils/formatters';

type OpenInterestProps = {
	long: number;
	short: number;
};

export const OpenInterest: FC<OpenInterestProps> = ({ long, short }) => {
	if (!long || !short) {
		return null;
	}

	const range = long + short;

	const longPercent = long / range;
	const shortPercent = short / range;

	return (
		<Container>
			<Headline>open interest:</Headline>
			<Interest>
				<Longs className="longs label">{formatPercentage(longPercent)}</Longs>
				<FlexDivRowCentered>
					<LongsPercent
						className="longs-percent percent"
						style={{ width: `calc(${longPercent * 100}% - 2px)` }}
					/>
					<ShortsPercent
						className="shorts-percent percent"
						style={{ width: `calc(${shortPercent * 100}% - 2px)` }}
					/>
				</FlexDivRowCentered>
				<Shorts className="shorts label">{formatPercentage(shortPercent)}</Shorts>
			</Interest>
		</Container>
	);
};

const Container = styled(FlexDivCentered)`
	padding-right: 20px;
`;

const Headline = styled.div`
	text-transform: uppercase;
	font-size: 12px;
	font-family: ${(props) => props.theme.fonts.medium};
	padding-right: 8px;
`;

const Interest = styled(GridDivCentered)`
	${labelSmallCSS};
	grid-gap: 4px;
	> * {
		width: 100%;
	}
	grid-template-columns: auto 1fr auto;
	width: 300px;
`;

const Longs = styled.div`
	color: ${(props) => props.theme.colors.fontSecondary};
`;
const Shorts = styled.div`
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const LongsPercent = styled.div`
	height: 8px;
	background-color: ${(props) => props.theme.colors.green};
	border-top-left-radius: 2px;
	border-bottom-left-radius: 2px;
`;
const ShortsPercent = styled.div`
	height: 8px;
	background-color: ${(props) => props.theme.colors.red};
	border-top-right-radius: 2px;
	border-bottom-right-radius: 2px;
`;

export default OpenInterest;
