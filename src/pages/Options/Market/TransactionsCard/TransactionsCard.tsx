import React, { FC, memo, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { FlexDiv } from 'shared/commonStyles';

import { CARD_HEIGHT } from 'constants/ui';
import { OptionsMarketInfo } from 'ducks/options/types';

import Card from 'components/Card';

import RecentTransactions from './RecentTransactions';
import YourTransactions from './YourTransactions';

type TransactionsCardProps = {
	optionsMarket: OptionsMarketInfo;
};

const TransactionsCard: FC<TransactionsCardProps> = memo(({ optionsMarket }) => {
	const { t } = useTranslation();

	const tabContent = useMemo(
		() => [
			{
				name: t('options.market.transactions-card.recent-market-tab-title'),
				id: 'recent-transactions',
				component: <RecentTransactions marketAddress={optionsMarket.address} />,
			},
			// disable tab if not logged in
			{
				name: t('options.market.transactions-card.your-activity-tab-title'),
				id: 'your-transactions',
				component: <YourTransactions marketAddress={optionsMarket.address} />,
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
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
						>
							{tab.name}
						</TabButton>
					))}
				</FlexDiv>
				{activeTab.component}
			</StyledCardBody>
		</StyledCard>
	);
});

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

const TabButton = styled.button<{ isActive: boolean }>`
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
`;

export default TransactionsCard;
