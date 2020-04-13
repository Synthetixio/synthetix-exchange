import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import get from 'lodash/get';

import PropTypes from 'prop-types';

import Card from 'components/Card';
import { HeadingSmall } from 'components/Typography';
import { headingH5CSS } from 'components/Typography/Heading';

import {
	getIsLoadedWalletBalances,
	getTotalSynthsBalanceUSD,
	getWalletBalances,
	getTotalETHBalance,
} from 'ducks/wallet/walletBalances';
import { getAvailableSynthsMap } from 'ducks/synths';

import { formatCurrencyWithSign, formatCurrency } from 'utils/formatters';
import { FIAT_CURRENCY_MAP, CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'constants/currency';
import { EMPTY_VALUE } from 'constants/placeholder';
import { FlexDivRow } from 'shared/commonStyles';

export const TotalBalance = memo(
	({ isLoadedWalletBalances, totalSynthsBalanceUSD, synthsMap, totalETHBalance }) => {
		const { t } = useTranslation();

		return (
			<Container>
				<Card>
					<Card.Header>
						<HeadingSmall>{t('assets.overview.dashboard.total-balance.title')}</HeadingSmall>
					</Card.Header>
					<Card.Body>
						<Balance>
							{isLoadedWalletBalances
								? `${formatCurrencyWithSign(
										get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
										totalSynthsBalanceUSD
								  )} ${FIAT_CURRENCY_MAP.USD}`
								: EMPTY_VALUE}
						</Balance>
					</Card.Body>
				</Card>
				<Card>
					<Card.Body>
						<FlexDivRow>
							<HeadingSmall>
								{t('common.wallet.currency-balance', {
									currencyKey: CRYPTO_CURRENCY_MAP.ETH,
								})}
							</HeadingSmall>
							<ETHBalance>
								{isLoadedWalletBalances ? formatCurrency(totalETHBalance) : EMPTY_VALUE}
							</ETHBalance>
						</FlexDivRow>
					</Card.Body>
				</Card>
			</Container>
		);
	}
);

TotalBalance.propTypes = {
	synthsMap: PropTypes.object,
	isLoadedWalletBalances: PropTypes.bool.isRequired,
	totalSynthsBalanceUSD: PropTypes.number,
};

const Container = styled.div`
	display: grid;
	grid-gap: 8px;
	grid-auto-flow: row;
`;

const Balance = styled.div`
	color: ${(props) => props.theme.colors.fontSecondary};
	${headingH5CSS};
`;

const ETHBalance = styled(HeadingSmall)`
	color: ${(props) => props.theme.colors.fontSecondary};
`;

const mapStateToProps = (state) => ({
	synthsMap: getAvailableSynthsMap(state),
	walletBalances: getWalletBalances(state),
	isLoadedWalletBalances: getIsLoadedWalletBalances(state),
	totalSynthsBalanceUSD: getTotalSynthsBalanceUSD(state),
	totalETHBalance: getTotalETHBalance(state),
});

export default connect(mapStateToProps, null)(TotalBalance);
