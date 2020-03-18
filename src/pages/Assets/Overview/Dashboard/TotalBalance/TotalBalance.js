import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import get from 'lodash/get';

import PropTypes from 'prop-types';

import Card from 'src/components/Card';
import { HeadingSmall } from 'src/components/Typography';

import { getIsLoadedWalletBalances, getTotalWalletSynthsBalanceUSD } from 'src/ducks/wallet';
import { getAvailableSynthsMap } from 'src/ducks/synths';

import { formatCurrencyWithSign } from 'src/utils/formatters';
import { SYNTHS_MAP } from 'src/constants/currency';
import { EMPTY_VALUE } from 'src/constants/placeholder';

export const TotalBalance = memo(
	({ isLoadedWalletBalances, totalWalletSynthsBalanceUSD, synthsMap }) => {
		const { t } = useTranslation();

		return (
			<Card>
				<Card.Header>
					<HeadingSmall>{t('assets.overview.dashboard.total-balance.title')}</HeadingSmall>
				</Card.Header>
				<StyledCardBody>
					<Balance>
						{isLoadedWalletBalances
							? formatCurrencyWithSign(
									get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
									totalWalletSynthsBalanceUSD
							  )
							: EMPTY_VALUE}
					</Balance>
				</StyledCardBody>
			</Card>
		);
	}
);

const Balance = styled.div`
	color: ${props => props.theme.colors.fontPrimary};
	font-size: 20px;
`;

const StyledCardBody = styled(Card.Body)`
	height: 120px;
`;

TotalBalance.propTypes = {
	synthsMap: PropTypes.object,
	isLoadedWalletBalances: PropTypes.bool.isRequired,
	totalWalletSynthsBalanceUSD: PropTypes.number,
};

const mapStateToProps = state => ({
	synthsMap: getAvailableSynthsMap(state),
	isLoadedWalletBalances: getIsLoadedWalletBalances(state),
	totalWalletSynthsBalanceUSD: getTotalWalletSynthsBalanceUSD(state),
});

export default connect(mapStateToProps, null)(TotalBalance);
