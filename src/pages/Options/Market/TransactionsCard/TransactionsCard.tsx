import React, { FC, memo, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import Card from 'components/Card';

import RecentTransactions from './RecentTransactions';
import YourTransactions from './YourTransactions';
import { OptionsMarketInfo } from 'ducks/options/types';

type TransactionsCardProps = {
	optionsMarket: OptionsMarketInfo;
};

const TransactionsCard: FC<TransactionsCardProps> = memo(({ optionsMarket }) => {
	const { t } = useTranslation();

	const tabContent = useMemo(
		() => [
			{
				name: 'recent',
				id: 'recent-transactions',
				component: <RecentTransactions marketAddress={optionsMarket.address} />,
			},
			{
				name: 'your',
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
				<Tabs>
					{tabContent.map((tab) => (
						<Tab key={tab.id} onClick={() => setActiveTab(tab)} isActive={tab.id === activeTab.id}>
							<span>{tab.name}</span>
						</Tab>
					))}
				</Tabs>
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
`;

const Tabs = styled.div`
	display: flex;
`;

const Tab = styled.button<{ isActive: boolean }>`
	height: 42px;
	padding: 0 18px;
	display: flex;
	justify-content: center;
	align-items: center;
	outline: none;
	border: none;
	cursor: pointer;
	background-color: ${(props) =>
		props.isActive ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background-color: ${(props) => props.theme.colors.surfaceL3};
	}
`;

export default TransactionsCard;
