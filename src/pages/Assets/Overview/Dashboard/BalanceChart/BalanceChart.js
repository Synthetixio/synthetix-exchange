import React, { memo } from 'react';
import styled, { withTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts';

import Card from 'components/Card';
import { HeadingSmall } from 'components/Typography';
import { labelMediumCSS } from 'components/Typography/Label';
import { absoluteCenteredCSS } from 'shared/commonStyles';

import { CardHeadingDescription } from 'shared/commonStyles';

// TODO: implement using real data
import { MOCK_DATA } from './mockData';

export const BalanceChart = memo(({ theme: { colors } }) => {
	const { t } = useTranslation();

	return (
		<Card>
			<Card.Header>
				<HeadingSmall>{t('assets.overview.dashboard.balance-chart.title')}</HeadingSmall>
				<CardHeadingDescription>
					{t('assets.overview.dashboard.balance-chart.period.1mo')}
				</CardHeadingDescription>
			</Card.Header>
			<StyledCardBody>
				<StyledResponsiveContainer width="99%" height="100%">
					<AreaChart data={MOCK_DATA}>
						<defs>
							<linearGradient id="synthBalanceChartArea" x1="0" y1="0" x2="0" y2="1">
								<stop offset="5%" stopColor={colors.hyperlink} stopOpacity={0.5} />
								<stop offset="95%" stopColor={colors.hyperlink} stopOpacity={0} />
							</linearGradient>
						</defs>
						<XAxis dataKey="timestamp" reversed={true} hide={true} />
						<YAxis type="number" domain={['auto', 'auto']} hide={true} />
						<Area
							dataKey="rate"
							stroke={colors.hyperlink}
							fillOpacity={0.5}
							fill="url(#synthBalanceChartArea)"
							isAnimationActive={false}
						/>
					</AreaChart>
				</StyledResponsiveContainer>
				<Message>{t('common.features.coming-soon')}</Message>
			</StyledCardBody>
		</Card>
	);
});

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	height: 120px;
	position: relative;
`;

const Message = styled.div`
	${absoluteCenteredCSS};
	${labelMediumCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	text-transform: uppercase;
`;

const StyledResponsiveContainer = styled(ResponsiveContainer)`
	filter: blur(4px);
`;

export default withTheme(BalanceChart);
