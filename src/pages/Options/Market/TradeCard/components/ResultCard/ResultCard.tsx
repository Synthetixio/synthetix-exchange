import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { GridDivCenteredCol } from 'shared/commonStyles';
import { Side } from 'pages/Options/types';

import { headingH6CSS } from 'components/Typography/Heading';

import OptionResult from '../OptionResult';

type ResultCardProps = {
	icon: React.ReactNode;
	title: React.ReactNode;
	subTitle: React.ReactNode;
	longAmount: number;
	shortAmount: number;
	longPrice?: number;
	shortPrice?: number;
	result?: Side;
	exercised?: boolean;
	claimableLongAmount?: number;
	claimableShortAmount?: number;
};

const ResultCard: FC<ResultCardProps> = ({
	icon,
	title,
	subTitle,
	longAmount,
	shortAmount,
	longPrice,
	shortPrice,
	result,
	exercised,
	claimableLongAmount,
	claimableShortAmount,
	...rest
}) => (
	<Container {...rest}>
		<Icon>{icon}</Icon>
		<Title>{title}</Title>
		<Subtitle>{subTitle}</Subtitle>
		<OptionResults result={result} exercised={exercised}>
			<OptionResult
				side="long"
				amount={longAmount}
				price={longPrice}
				claimableAmount={claimableLongAmount}
			/>
			<OptionResult
				side="short"
				amount={shortAmount}
				price={shortPrice}
				claimableAmount={claimableShortAmount}
			/>
		</OptionResults>
	</Container>
);

const Container = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL3};
	margin: 16px;
	padding: 18px;
`;

const Icon = styled.div`
	text-align: center;
	padding-top: 10px;
	padding-bottom: 13px;
`;

const Title = styled.div`
	text-align: center;
	padding-bottom: 4px;
	${headingH6CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	text-transform: uppercase;
`;

const Subtitle = styled.div`
	text-align: center;
	padding-bottom: 20px;
	color: ${(props) => props.theme.colors.fontTertiary};
	font-size: 12px;
`;

const OptionResults = styled(GridDivCenteredCol)<{ result?: Side; exercised?: boolean }>`
	grid-gap: 16px;
	padding-bottom: 20px;
	${(props) =>
		props.result &&
		css`
			.long {
				opacity: ${props.result === 'long' ? 1 : 0.5};
			}
			.short {
				opacity: ${props.result === 'short' ? 1 : 0.5};
			}
		`}
	${(props) =>
		props.exercised &&
		css`
			.long,
			.short {
				opacity: 0.5;
			}
		`}
`;

export default ResultCard;
