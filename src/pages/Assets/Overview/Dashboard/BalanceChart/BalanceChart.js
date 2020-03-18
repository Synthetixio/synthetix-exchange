import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import PropTypes from 'prop-types';

import Card from 'src/components/Card';
import { HeadingSmall } from 'src/components/Typography';

import { getCurrentTheme } from 'src/ducks/index';

export const BalanceChart = memo(({ currentTheme }) => {
	const { t } = useTranslation();

	return (
		<Card>
			<Card.Header>
				<HeadingSmall>{t('assets.overview.dashboard.balance-chart.title')}</HeadingSmall>
			</Card.Header>
			<StyledCardBody>sdsdsd</StyledCardBody>
		</Card>
	);
});

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	height: 120px;
`;

BalanceChart.propTypes = {
	currentTheme: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(BalanceChart);
