import React, { useEffect } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';

import {
	getTop10Leaders,
	getIsLoadingLeaderboard,
	getIsRefreshingLeaderboard,
	getIsLoadedLeaderboard,
	fetchLeaderboardRequest,
} from 'src/ducks/leaderboard';
import { hideLeaderboardPopup } from 'src/ducks/ui';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';

import { formatCurrencyWithSign } from 'src/utils/formatters';

import Link from 'src/components/Link';
import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';

import { headingLargeCSS } from 'src/components/Typography/Heading';

import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';
import { CenteredContent, Popup } from 'src/shared/commonStyles';

const LeaderboardPopup = ({
	hideLeaderboardPopup,
	isLoadingLeaderboard,
	isLoadedLeaderboard,
	isRefreshingLeaderboard,
	top10leaders,
	fetchLeaderboardRequest,
}) => {
	useEffect(() => {
		fetchLeaderboardRequest();
		// eslint-disable-next-line
	}, []);
	console.log(isRefreshingLeaderboard);
	console.log(isRefreshingLeaderboard);
	return (
		<Popup>
			<SimpleAppHeader />
			<Content>
				<Headline>SYNTHETIX.EXCHANGE L2</Headline>
				<HeadlineDesc>Trading Comp Top 10 Leaderboard</HeadlineDesc>
				<CloseButton onClick={hideLeaderboardPopup}>
					<CloseCrossIcon />
				</CloseButton>
				<Table
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
							accessor: 'twitterUsername',
							Cell: cellProps => (
								<StyledLink to={`https://twitter.com/${cellProps.cell.value}`} isExternal={true}>
									@{cellProps.cell.value}
								</StyledLink>
							),
							width: 250,
						},
						{
							Header: 'ASSET VALUE',
							accessor: 'assetValue',
							Cell: cellProps => (
								<span>{formatCurrencyWithSign('$', cellProps.cell.value)} USD</span>
							),
							width: 150,
						},
					]}
					data={top10leaders}
					isLoading={isLoadingLeaderboard && !isLoadedLeaderboard}
				/>
			</Content>
		</Popup>
	);
};

const Content = styled(CenteredContent)`
	max-width: 600px;
	padding-top: 87px;
`;

const Headline = styled.div`
	${headingLargeCSS};
	text-shadow: 0px 0px 10px #b47598;
	padding-bottom: 12px;
	text-transform: uppercase;
	font-size: 40px;
	line-height: 49px;
	padding: 0;
`;

const HeadlineDesc = styled(Headline)`
	font-weight: normal;
	font-size: 30px;
	padding-bottom: 50px;
	font-family: ${props => props.theme.fonts.regular};
`;

const CloseButton = styled.button`
	border: none;
	background: none;
	cursor: pointer;
	position: absolute;
	right: -100px;
	top: 97px;
	outline: none;
	svg {
		width: 20px;
		height: 20px;
	}
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
	isRefreshingLeaderboard: getIsRefreshingLeaderboard(state),
});

const mapDispatchToProps = {
	hideLeaderboardPopup,
	fetchLeaderboardRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPopup);
