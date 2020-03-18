import React, { memo } from 'react';
import styled, { withTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import sumBy from 'lodash/sumBy';
import { PieChart, Pie, Cell } from 'recharts';

import PropTypes from 'prop-types';

import Card from 'src/components/Card';
import { HeadingSmall } from 'src/components/Typography';
import { formatPercentage } from 'src/utils/formatters';

import { getIsLoadedWalletBalances, getSynthsWalletBalances } from 'src/ducks/wallet';

const TOP_HOLDINGS = 4;

export const WalletBreakdown = memo(({ isLoadedWalletBalances, synthsWalletBalances, theme }) => {
	const { t } = useTranslation();
	const COLORS = [
		theme.colors.icons,
		theme.colors.buttonDefault,
		theme.colors.buttonHover,
		theme.colors.fontTertiary,
		theme.colors.fontSecondary,
	];

	let topHoldings = synthsWalletBalances.slice(0, TOP_HOLDINGS);

	if (synthsWalletBalances.length > TOP_HOLDINGS) {
		topHoldings.push({
			portfolioPercent: 1 - sumBy(topHoldings, 'portfolioPercent'),
			name: t('assets.overview.dashboard.wallet-breakdown.assets.other'),
		});
	}

	return (
		<Card>
			<Card.Header>
				<HeadingSmall>{t('assets.overview.dashboard.wallet-breakdown.title')}</HeadingSmall>
			</Card.Header>
			<StyledCardBody>
				{isLoadedWalletBalances && (
					<Container>
						<PieChart width={92} height={92}>
							<Pie
								data={topHoldings}
								dataKey="portfolioPercent"
								innerRadius={25}
								outerRadius={45}
								cx="50%"
								cy="50%"
								isAnimationActive={false}
								stroke="none"
							>
								{topHoldings.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
								))}
							</Pie>
						</PieChart>
						<ChartLegend>
							{topHoldings.map((balance, index) => (
								<ChartLegendItem key={balance.name}>
									<ChartLegendItemColor
										style={{
											background: COLORS[index % COLORS.length],
										}}
									/>
									<span>
										{balance.name}: {formatPercentage(balance.portfolioPercent)}
									</span>
								</ChartLegendItem>
							))}
						</ChartLegend>
					</Container>
				)}
			</StyledCardBody>
		</Card>
	);
});

const StyledCardBody = styled(Card.Body)`
	height: 120px;
`;

const Container = styled.div`
	display: grid;
	grid-gap: 20px;
	grid-template-columns: auto 1fr;
	align-items: center;
`;

const ChartLegend = styled.ul``;

const ChartLegendItem = styled.li`
	display: grid;
	grid-gap: 8px;
	grid-template-columns: auto 1fr;
	align-items: center;
	font-size: 12px;
	color: ${props => props.theme.colors.fontPrimary};
	margin-bottom: 5px;
`;

const ChartLegendItemColor = styled.span`
	width: 10px;
	height: 10px;
	border-radius: 1px;
`;

WalletBreakdown.propTypes = {
	isLoadedWalletBalances: PropTypes.bool.isRequired,
	synthsWalletBalances: PropTypes.array,
	theme: PropTypes.object,
};

const mapStateToProps = state => ({
	isLoadedWalletBalances: getIsLoadedWalletBalances(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
});

export default connect(mapStateToProps, null)(withTheme(WalletBreakdown));
