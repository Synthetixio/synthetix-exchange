import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import CreateOrderCard from '../components/CreateOrderCard';
import PairListPanel from '../components/ChartCard/PairListPanel';
import { showLeaderboardPopup, showDashboardPopup } from 'src/ducks/ui';

import { ReactComponent as LeaderboardIcon } from 'src/assets/images/l2/leaderboard.svg';
import { ReactComponent as DashboardIcon } from 'src/assets/images/l2/dashboard.svg';

import { DataSmall } from 'src/components/Typography';

import MyOrders from '../components/OrderBookCard/myOrders';
// import History from './History';

const TradeMobile = ({ showLeaderboardPopup, showDashboardPopup }) => {
	const tabContent = useMemo(
		() => [
			{
				name: 'Trade',
				id: 'trade',
				component: (
					<>
						<PairListPanel />
						<CreateOrderCard />
					</>
				),
			},
			{
				name: 'History',
				id: 'history',
				component: <MyOrders isMobile={true} />,
			},
			{
				name: <DashboardIcon />,
				id: 'dashboard',
				component: null,
				onClick: showDashboardPopup,
			},
			{
				name: <LeaderboardIcon />,
				id: 'leaderboard',
				component: null,
				onClick: showLeaderboardPopup,
			},
		],
		// eslint-disable-next-line
		[]
	);

	const [activeTab, setActiveTab] = useState(tabContent[0]);

	return (
		<>
			<Tabs>
				{tabContent.map(tab => (
					<Tab
						key={tab.id}
						onClick={() => {
							if (tab.onClick) {
								tab.onClick();
							} else {
								setActiveTab(tab);
							}
						}}
						active={tab.id === activeTab.id}
					>
						<DataSmall>{tab.name}</DataSmall>
					</Tab>
				))}
			</Tabs>
			{activeTab.component}
		</>
	);
};

const Tabs = styled.div`
	display: grid;
	grid-auto-flow: column;
	border-bottom: 1px solid #3230b0;
`;

const Tab = styled.button`
	height: 40px;
	padding: 0 18px;
	outline: none;
	border: none;
	cursor: pointer;
	background: ${props =>
		props.active ? props.theme.colors.accentL1 : props.theme.colors.surfaceL3};

	span {
		color: ${props =>
			props.active ? props.theme.colors.fontPrimary : props.theme.colors.fontTertiary};
	}
	&:hover {
		background: ${props => props.theme.colors.accentL1};
		span {
			color: ${props => props.theme.colors.fontPrimary};
		}
	}
`;

const mapDispatchToProps = {
	showLeaderboardPopup,
	showDashboardPopup,
};

export default connect(null, mapDispatchToProps)(TradeMobile);
