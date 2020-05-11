import React, { useState, useMemo, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import {
	getSortedLeaderboard,
	getIsLoadingLeaderboard,
	getIsLoadedLeaderboard,
	fetchLeaderboardRequest,
} from 'src/ducks/leaderboard';
import { getCurrentWalletAddress } from 'src/ducks/wallet/walletDetails';

import { ReactComponent as StarIcon } from 'src/assets/images/l2/star.svg';

import { formatCurrencyWithSign } from 'src/utils/formatters';

import Table from 'src/components/Table';
import { SearchInput } from 'src/components/Input';
import { TABLE_PALETTE } from 'src/components/Table/constants';

import { textShadowCSS } from 'src/shared/commonStyles';

import { media, smallMediaQuery } from 'src/shared/media';

const LeaderboardTable = ({
	isLoadingLeaderboard,
	isLoadedLeaderboard,
	leaderboard,
	fetchLeaderboardRequest,
	currentWallet,
	setSelectedUser,
}) => {
	const [twitterHandleSearch, setTwitterHandleSearch] = useState('');

	useEffect(() => {
		fetchLeaderboardRequest();
		// eslint-disable-next-line
	}, []);

	const isMobile = useMediaQuery({ query: smallMediaQuery });

	const filteredLeaderboard = useMemo(
		() =>
			twitterHandleSearch.length > 0
				? leaderboard.filter(({ twitterHandle }) => {
						const twitterHandleLowered = twitterHandle.toLowerCase();
						const searchQueryLowered = twitterHandleSearch.toLowerCase().replace('@', '');

						return twitterHandleLowered.includes(searchQueryLowered);
				  })
				: leaderboard.slice(0, 50),
		[leaderboard, twitterHandleSearch]
	);

	return (
		<>
			<Headline>
				<span>SYNTHETIX.</span>EXCHANGE L2
			</Headline>
			<Description>Trading Comp Top 50 Leaderboard</Description>

			<TwitterHandleSearchInput
				onChange={e => setTwitterHandleSearch(e.target.value)}
				value={twitterHandleSearch}
				placeholder="e.g @VitalikButerin"
			/>
			<StyledTable
				palette={TABLE_PALETTE.LEADERBOARD}
				columns={[
					{
						Header: 'RANK',
						accessor: 'rank',
						Cell: cellProps => (
							<Rank isCurrentWallet={cellProps.row.original.address === currentWallet}>
								{cellProps.cell.value}
							</Rank>
						),
						width: 80,
					},
					{
						Header: 'TWITTER HANDLE',
						accessor: 'twitterHandle',
						Cell: cellProps => {
							const isCurrentWallet = cellProps.row.original.address === currentWallet;

							return (
								<TwitterHandle>
									@{cellProps.cell.value}{' '}
									{isCurrentWallet && <StarIcon style={{ marginLeft: '5px' }} />}
								</TwitterHandle>
							);
						},
						width: isMobile ? 140 : 250,
					},
					{
						Header: 'ASSET VALUE',
						accessor: 'assetValue',
						sortType: 'basic',
						Cell: cellProps => (
							<AssetValue isCurrentWallet={cellProps.row.original.address === currentWallet}>
								{formatCurrencyWithSign('$', cellProps.cell.value)} USD
							</AssetValue>
						),
						width: isMobile ? 130 : 150,
					},
				]}
				columnsDeps={[isMobile]}
				data={filteredLeaderboard}
				isLoading={isLoadingLeaderboard && !isLoadedLeaderboard}
				noResultsMessage={
					twitterHandleSearch && filteredLeaderboard.length === 0 ? (
						<NoResultsMessage>No results for {twitterHandleSearch}</NoResultsMessage>
					) : undefined
				}
				onTableRowClick={row => setSelectedUser(row.original)}
			/>
		</>
	);
};

const NoResultsMessage = styled.div`
	padding: 18px;
`;

const TwitterHandleSearchInput = styled(SearchInput)`
	max-width: 540px;
	width: 100%;
	margin: 30px 0;
	${media.small`
		max-width: 300px;
	`}
`;

const currentUserTextCSS = css`
	color: #68ec9b;
`;

const AssetValue = styled.span`
	${props => props.isCurrentWallet && currentUserTextCSS};
`;

const StyledTable = styled(Table)`
	overflow: hidden;
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
	text-align: center;
	${media.small`
		max-width: 280px;
		font-size: 24px;
		line-height: 29px;
	`}
`;

const Rank = styled.span`
	color: ${props => props.theme.colors.hyperlink};
	${props => props.isCurrentWallet && currentUserTextCSS};
`;

const TwitterHandle = styled.span`
	display: flex;
	align-items: center;
	color: ${props => props.theme.colors.fontPrimary};
	${props => props.isCurrentWallet && currentUserTextCSS};
`;

const mapStateToProps = state => ({
	currentWallet: getCurrentWalletAddress(state),
	leaderboard: getSortedLeaderboard(state),
	isLoadingLeaderboard: getIsLoadingLeaderboard(state),
	isLoadedLeaderboard: getIsLoadedLeaderboard(state),
});

const mapDispatchToProps = {
	fetchLeaderboardRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardTable);
