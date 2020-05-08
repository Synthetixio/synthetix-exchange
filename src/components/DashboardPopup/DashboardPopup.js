import React, { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';
import { useMediaQuery } from 'react-responsive';

import { getDashboardData, fetchDashboardRequest } from 'src/ducks/dashboard';
import { getHoldersData, fetchHoldersRequest } from 'src/ducks/holders';
import { hideDashboardPopup } from 'src/ducks/ui';
import { getAvailableSynthsMap } from 'src/ducks/synths';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';

import { formatCurrencyWithSign, formatCurrency } from 'src/utils/formatters';
import { SYNTHS_MAP } from 'src/constants/currency';

import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';
import PieChart from './PieChart';
import BarChart from './BarChart';

import {
	CenteredContent,
	Popup,
	textShadowCSS,
	resetButtonCSS,
	InfoBox,
	InfoBoxLabel,
	InfoBoxValue,
} from 'src/shared/commonStyles';

import { media, smallMediaQuery } from 'src/shared/media';

const DashboardPopup = ({
	hideDashboardPopup,
	fetchDashboardRequest,
	dashboardData,
	synthsMap,
	fetchHoldersRequest,
	holdersData,
}) => {
	useEffect(() => {
		fetchDashboardRequest();
		fetchHoldersRequest();
		// eslint-disable-next-line
	}, []);

	const isMobile = useMediaQuery({ query: smallMediaQuery });
	const { daily, total, openInterest, topSynths } = dashboardData;

	const topRowData = [
		{ heading: 'Total Wallets', data: formatCurrency(holdersData.total) },
		{ heading: 'Daily Trades', data: (daily && formatCurrency(daily.trades)) || 0 },

		{
			heading: 'Daily Volume ($USD)',
			data: (daily && formatCurrencyWithSign(synthsMap[SYNTHS_MAP.sUSD].sign, daily.volume)) || 0,
		},
	];

	const middleRowData = [
		{ heading: 'Cumulative Trades', data: (total && formatCurrency(total.trades)) || 0 },
		{
			heading: 'Cumulative Volume ($USD)',
			data: (total && formatCurrencyWithSign(synthsMap[SYNTHS_MAP.sUSD].sign, total.volume)) || 0,
		},
	];

	return (
		<Popup>
			<SimpleAppHeader onClick={hideDashboardPopup} />
			<Content>
				<Headline>
					<span>SYNTHETIX.</span>EXCHANGE L2
				</Headline>
				<Description>Dashboard</Description>
				<CloseButton onClick={hideDashboardPopup}>
					<CloseCrossIcon />
				</CloseButton>
				<InfoBoxContainer>
					<InfoBoxRow isMobile={isMobile}>
						{topRowData.map(element => (
							<StyledInfoBox key={`infobox-${element.heading}`}>
								<StyledInfoBoxLabel>{element.heading}</StyledInfoBoxLabel>
								<StyledInfoBoxValue>{element.data}</StyledInfoBoxValue>
							</StyledInfoBox>
						))}
					</InfoBoxRow>
					<InfoBoxRow isMobile={isMobile}>
						{middleRowData.map(element => (
							<StyledInfoBox key={`infobox-${element.heading}`}>
								<StyledInfoBoxLabel>{element.heading}</StyledInfoBoxLabel>
								<StyledInfoBoxValue>{element.data}</StyledInfoBoxValue>
							</StyledInfoBox>
						))}
					</InfoBoxRow>
					<ChartBoxRow isMobile={isMobile}>
						<StyledInfoBox>
							<StyledInfoBoxLabel>Open Interest</StyledInfoBoxLabel>
							<BarChart data={openInterest} />
						</StyledInfoBox>
						<StyledInfoBox style={{ height: '370px' }}>
							<StyledInfoBoxLabel>Synths Distribution</StyledInfoBoxLabel>
							<PieChart data={topSynths} />
						</StyledInfoBox>
					</ChartBoxRow>
				</InfoBoxContainer>
			</Content>
		</Popup>
	);
};

const Content = styled(CenteredContent)`
	height: 100%;
	overflow: auto;
	max-width: 912px;
	justify-content: flex-start;
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

const mobileConfig = css`
	padding: 0 24px;
	grid-auto-flow: row;
	grid-gap: 12px;
	margin-bottom: 12px;
	& > div {
		padding: 16px;
	}
`;

const InfoBoxContainer = styled.div`
	width: 100%;
`;

const InfoBoxRow = styled.div`
	width: 100%;
	display: grid;
	grid-auto-flow: column;
	grid-gap: 40px;
	margin-bottom: 40px;
	grid-auto-columns: 1fr;
	${props => props.isMobile && mobileConfig}
`;

const ChartBoxRow = styled.div`
	width: 100%;
	display: grid;
	grid-auto-flow: column;
	grid-gap: 40px;
	grid-auto-columns: 1.5fr 1fr;
	${props => props.isMobile && mobileConfig}
`;

const StyledInfoBox = styled(InfoBox)`
	text-align: center;
	border: 0.5px solid #cb5bf2;
	grid-row-gap: 7px;
	padding: 28px;
`;

const StyledInfoBoxLabel = styled(InfoBoxLabel)`
	font-size: 14px;
`;

const StyledInfoBoxValue = styled(InfoBoxValue)`
	font-size: 32px;
`;

const mapStateToProps = state => ({
	dashboardData: getDashboardData(state),
	holdersData: getHoldersData(state),
	synthsMap: getAvailableSynthsMap(state),
});

const mapDispatchToProps = {
	hideDashboardPopup,
	fetchDashboardRequest,
	fetchHoldersRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPopup);
