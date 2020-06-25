import React, { FC, memo, useState, useMemo } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect, ConnectedProps } from 'react-redux';

import { FlexDiv } from 'shared/commonStyles';

import { CARD_HEIGHT } from 'constants/ui';

import { OptionsMarketInfo } from 'ducks/options/types';
import { RootState } from 'ducks/types';
import { getIsLoggedIn, getCurrentWalletAddress } from 'ducks/wallet/walletDetails';

import Card from 'components/Card';

import RecentTransactions from './RecentTransactions';
import YourTransactions from './YourTransactions';

const mapStateToProps = (state: RootState) => ({
	walletAddress: getCurrentWalletAddress(state),
	isLoggedIn: getIsLoggedIn(state),
});

const connector = connect(mapStateToProps, {});

type PropsFromRedux = ConnectedProps<typeof connector>;

type TransactionsCardProps = PropsFromRedux & {
	optionsMarket: OptionsMarketInfo;
};

const TransactionsCard: FC<TransactionsCardProps> = memo(
	({ optionsMarket, walletAddress, isLoggedIn }) => {
		const { t } = useTranslation();

		const tabContent = useMemo(
			() => [
				{
					name: t('options.market.transactions-card.recent-market-tab-title'),
					id: 'recent-transactions',
					component: <RecentTransactions marketAddress={optionsMarket.address} />,
					isDisabled: false,
				},
				{
					name: t('options.market.transactions-card.your-activity-tab-title'),
					id: 'your-transactions',
					component: (
						<YourTransactions
							marketAddress={optionsMarket.address}
							walletAddress={walletAddress!}
						/>
					),
					isDisabled: !isLoggedIn,
				},
			],
			[isLoggedIn, optionsMarket.address, t, walletAddress]
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
					{activeTab.component}
				</StyledCardBody>
			</StyledCard>
		);
	}
);

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
