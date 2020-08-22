import React, { FC, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import { FlexDiv } from 'shared/commonStyles';

import { CARD_HEIGHT } from 'constants/ui';

import { RootState } from 'ducks/types';
import { getIsWalletConnected, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';

import Card from 'components/Card';

import RecentTransactions from './RecentTransactions';
import YourTransactions from './YourTransactions';

import { useMarketContext } from '../contexts/MarketContext';
import PendingTransactions from './PendingTransactions';

const mapStateToProps = (state: RootState) => ({
	walletAddress: getCurrentWalletAddress(state),
	isWalletConnected: getIsWalletConnected(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type TransactionsCardProps = PropsFromRedux;

const TransactionsCard: FC<TransactionsCardProps> = ({ walletAddress, isWalletConnected }) => {
	const { t } = useTranslation();
	const optionsMarket = useMarketContext();

	const tabContent: Array<{
		id: 'recent-transactions' | 'your-transactions' | 'pending-transactions';
		name: string;
		isDisabled: boolean;
	}> = useMemo(
		() => [
			{
				id: 'recent-transactions',
				name: t('options.market.transactions-card.recent-market-tab-title'),
				isDisabled: false,
			},
			{
				id: 'your-transactions',
				name: t('options.market.transactions-card.your-activity-tab-title'),
				isDisabled: !isWalletConnected,
			},
			{
				id: 'pending-transactions',
				name: t('options.market.transactions-card.pending-transactions-tab-title'),
				isDisabled: !isWalletConnected,
			},
		],
		[t, isWalletConnected]
	);

	const [activeTab, setActiveTab] = useState(tabContent[0]);

	return (
		<StyledCard>
			<StyledCardBody>
				<FlexDiv>
					{tabContent.map((tab) => (
						<TabButton
							key={tab.id}
							onClick={() => setActiveTab(tab)}
							isActive={tab.id === activeTab.id}
							isDisabled={tab.isDisabled}
						>
							{tab.name}
						</TabButton>
					))}
				</FlexDiv>
				{activeTab.id === 'recent-transactions' && (
					<RecentTransactions marketAddress={optionsMarket.address} />
				)}
				{activeTab.id === 'your-transactions' && (
					<YourTransactions marketAddress={optionsMarket.address} walletAddress={walletAddress!} />
				)}
				{activeTab.id === 'pending-transactions' && (
					<PendingTransactions
						marketAddress={optionsMarket.address}
						walletAddress={walletAddress!}
					/>
				)}
			</StyledCardBody>
		</StyledCard>
	);
};

const StyledCard = styled(Card)`
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	position: relative;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	flex-grow: 1;
	overflow: hidden;
	position: initial;
	display: flex;
	flex-direction: column;
	height: 100%;
`;

const TabButton = styled.button<{ isActive: boolean; isDisabled: boolean }>`
	height: ${CARD_HEIGHT};
	padding: 0 18px;
	display: flex;
	justify-content: center;
	align-items: center;
	outline: none;
	border: none;
	cursor: pointer;
	font-size: 12px;
	text-transform: uppercase;
	font-family: ${(props) => props.theme.fonts.medium};
	color: ${(props) => props.theme.colors.fontPrimary};
	background-color: ${(props) =>
		props.isActive ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background-color: ${(props) => props.theme.colors.surfaceL3};
	}
	${(props) =>
		props.isDisabled &&
		css`
			opacity: 0.2;
			pointer-events: none;
		`}
`;

export default connector(TransactionsCard);
