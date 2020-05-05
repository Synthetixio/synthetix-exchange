import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import {
	getTop10Leaders,
	getIsLoadingLeaderboard,
	getIsLoadedLeaderboard,
	fetchLeaderboardRequest,
} from 'src/ducks/leaderboard';
import { hideLeaderboardPopup } from 'src/ducks/ui';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';

import { formatCurrencyWithSign } from 'src/utils/formatters';

import Link from 'src/components/Link';
import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';

import useInterval from 'src/shared/hooks/useInterval';

import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';
import { CenteredContent, Popup, textShadowCSS, resetButtonCSS } from 'src/shared/commonStyles';

import { media, smallMediaQuery } from 'src/shared/media';

const REFRESH_INTERVAL = 30000;

const LeaderboardPopup = ({
	hideLeaderboardPopup,
	isLoadingLeaderboard,
	isLoadedLeaderboard,
	top10leaders,
	fetchLeaderboardRequest,
}) => {
	useEffect(() => {
		fetchLeaderboardRequest();
		// eslint-disable-next-line
	}, []);

	useInterval(() => {
		fetchLeaderboardRequest();
	}, REFRESH_INTERVAL);

	const isMobile = useMediaQuery({ query: smallMediaQuery });

	return (
		<Popup>
			<SimpleAppHeader onClick={hideLeaderboardPopup} />
			<Content>
				<Headline>
					<span>SYNTHETIX.</span>EXCHANGE L2
				</Headline>
				<Description>
					Notice: We are working on a fix to the leaderboard. Please stand by.
				</Description>
				<CloseButton onClick={hideLeaderboardPopup}>
					<CloseCrossIcon />
				</CloseButton>
				<StyledTable
					palette={TABLE_PALETTE.LEADERBOARD}
					columns={[
						{
							Header: 'RANK',
							accessor: 'rank',
							Cell: cellProps => <Rank>{cellProps.cell.value}</Rank>,
							width: 80,
						},
						{
							Header: 'TWITTER HANDLE',
							accessor: 'twitterHandle',
							Cell: cellProps => (
								<StyledLink to={`https://twitter.com/${cellProps.cell.value}`} isExternal={true}>
									@{cellProps.cell.value}
								</StyledLink>
							),
							width: isMobile ? 140 : 250,
						},
						{
							Header: 'ASSET VALUE',
							accessor: 'assetValue',
							sortType: 'basic',
							Cell: cellProps => (
								<span>{formatCurrencyWithSign('$', cellProps.cell.value)} USD</span>
							),
							width: isMobile ? 130 : 150,
						},
					]}
					columnsDeps={[isMobile]}
					data={top10leaders}
					isLoading={isLoadingLeaderboard && !isLoadedLeaderboard}
				/>
			</Content>
		</Popup>
	);
};

const StyledTable = styled(Table)`
	${media.small`
		.table-body-row {
			margin: 0;
			border-radius: initial;
			border-left: 0;
			border-right: 0;
			border-bottom: 0;
			&:last-child {
				border-bottom: 0.5px solid #cb5bf2;
			}
		}
	`}
`;

const Content = styled(CenteredContent)`
	max-width: 600px;
	padding-top: 40px;
	padding-bottom: 20px;
	${media.small`
		padding-top: 0;
	`}
`;

const Headline = styled.div`
	${textShadowCSS};
	font-family: ${props => props.theme.fonts.medium};
	margin-bottom: 12px;
	text-transform: uppercase;
	font-size: 40px;
	line-height: 49px;
	text-align: center;
	${media.small`
		font-size: 32px;
		line-height: 39px;
		span {
			display: block;
		}
	`}
`;

const Description = styled.div`
	${textShadowCSS};
	font-family: ${props => props.theme.fonts.medium};
	text-transform: uppercase;
	font-weight: normal;
	font-size: 30px;
	padding-bottom: 50px;
	text-align: center;
	${media.small`
		max-width: 280px;
		font-size: 24px;
		line-height: 29px;
	`}
`;

const CloseButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	right: 0;
	top: 50px;
	outline: none;
	svg {
		width: 20px;
		height: 20px;
	}
	${media.small`
		position: fixed;
		right: 10px;
		top: 15px;
	`}
`;

const Rank = styled.span`
	color: ${props => props.theme.colors.hyperlink};
`;

const StyledLink = styled(Link)`
	color: ${props => props.theme.colors.fontPrimary};
`;

const mapStateToProps = state => ({
	top10leaders: getTop10Leaders(state),
	isLoadingLeaderboard: getIsLoadingLeaderboard(state),
	isLoadedLeaderboard: getIsLoadedLeaderboard(state),
});

const mapDispatchToProps = {
	hideLeaderboardPopup,
	fetchLeaderboardRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPopup);
