import React, { useState, useMemo, useEffect } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from 'react-responsive';

import { getDashboardData, fetchDashboardRequest } from 'src/ducks/dashboard';
import { getAvailableSynthsMap } from 'src/ducks/synths';

import { DataSmall } from 'src/components/Typography';
import { FlexDivRow, FlexDivCentered, InfoBoxLabel, InfoBoxValue } from 'src/shared/commonStyles';
import { smallMediaQuery } from 'src/shared/media';

import Card from 'src/components/Card';
import MyOrders from './myOrders';
import MyTrades from './MyTrades';
import AllTrades from './AllTrades';

import useInterval from 'src/shared/hooks/useInterval';
import { SYNTHS_MAP } from 'src/constants/currency';
import { formatCurrencyWithSign } from 'src/utils/formatters';

const REFRESH_INTERVAL = 30000;

const OrderBookCard = ({ dashboardData, fetchDashboardRequest, synthsMap }) => {
	const { t } = useTranslation();

	useEffect(() => {
		fetchDashboardRequest();
		// eslint-disable-next-line
	}, []);

	useInterval(() => {
		fetchDashboardRequest();
	}, REFRESH_INTERVAL);

	const tabContent = useMemo(
		() => [
			{
				name: t('trade.order-book-card.tabs.your-orders'),
				id: 'myOrders',
				component: <MyOrders />,
			},
			{
				name: t('trade.order-book-card.tabs.your-trades'),
				id: 'myTrades',
				component: <MyTrades />,
			},
			{
				name: t('trade.order-book-card.tabs.all-trades'),
				id: 'allTrades',
				component: <AllTrades />,
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const isMobile = useMediaQuery({ query: smallMediaQuery });
	const [activeTab, setActiveTab] = useState(tabContent[0]);
	const { daily, total } = dashboardData;

	const metrics = [
		{
			label: 'Daily Volume:',
			value: (daily && formatCurrencyWithSign(synthsMap[SYNTHS_MAP.sUSD].sign, daily.volume)) || 0,
		},
		{
			label: 'Total Volume:',
			value: (total && formatCurrencyWithSign(synthsMap[SYNTHS_MAP.sUSD].sign, total.volume)) || 0,
		},
	];

	return (
		<StyledCard>
			<StyledCardBody>
				<FlexDivRow>
					<Tabs>
						{tabContent.map(tab => (
							<Tab key={tab.id} onClick={() => setActiveTab(tab)} active={tab.id === activeTab.id}>
								<DataSmall>{tab.name}</DataSmall>
							</Tab>
						))}
					</Tabs>
					{!isMobile ? (
						<FlexDivCentered>
							{metrics.map(metric => (
								<StyledInfoBox key={metric.label}>
									<InfoBoxLabel>{metric.label}</InfoBoxLabel>
									<StyledInfoBoxValue>{metric.value}</StyledInfoBoxValue>
								</StyledInfoBox>
							))}
						</FlexDivCentered>
					) : null}
				</FlexDivRow>
				{activeTab.component}
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
`;

const Tabs = styled.div`
	display: flex;
`;

const Tab = styled.button`
	min-width: 134px;
	height: 42px;
	padding: 0 18px;
	display: flex;
	justify-content: center;
	align-items: center;
	outline: none;
	border: none;
	cursor: pointer;
	background: ${props =>
		props.active ? props.theme.colors.surfaceL3 : props.theme.colors.surfaceL2};
	&:hover {
		background: ${props => props.theme.colors.surfaceL3};
	}
	${props =>
		props.isDisabled &&
		css`
			opacity: 0.2;
			pointer-events: none;
		`}
`;

const StyledInfoBox = styled.div`
	height: 26px;
	border: 1px solid ${props => props.theme.colors.accentL1};
	background: none;
	display: flex;
	align-items: center;
	padding: 0 11px;
	margin-right: 10px;
	& > :first-child {
		margin-right: 4px;
	}
`;

const StyledInfoBoxValue = styled(InfoBoxValue)`
	font-size: 12px;
	margin-top: -4px;
`;

const mapStateToProps = state => ({
	dashboardData: getDashboardData(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {
	fetchDashboardRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderBookCard);
