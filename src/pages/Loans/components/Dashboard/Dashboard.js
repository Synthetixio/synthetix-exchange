import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import Card from '../../../../components/Card';
import { HeadingSmall } from '../../../../components/Typography';
import { getWalletInfo } from '../../../../ducks';

import { getCurrencyKeyBalance } from '../../../../utils/balances';
import {
	formatPercentage,
	formatCurrency,
	formatCurrencyWithKey,
} from '../../../../utils/formatters';

import { COLLATERAL_PAIR } from '../../constants';
import { CARD_HEIGHT } from '../../../../constants/ui';

import { InfoBox, InfoBoxLabel, InfoBoxValue } from '../../../../shared/commonStyles';

const {
	INTEREST_RATE_PERCENT,
	COLLATERAL_CURRENCY_KEY,
	BORROWED_CURRENCY_KEY,
	MINTING_FEE_PERCENT,
	MIN_LOAN_SIZE,
	COLLAT_RATIO_PERCENT,
} = COLLATERAL_PAIR;

export const Dashboard = ({ walletInfo: { balances } }) => {
	const { t } = useTranslation();

	const lockedCurrencyBalance = getCurrencyKeyBalance(balances, COLLATERAL_CURRENCY_KEY);
	const borrowedCurrencyBalance = getCurrencyKeyBalance(balances, BORROWED_CURRENCY_KEY);
	const lockedCurrencyLoanSize = 1000;

	const numberOfLoans = 0;
	const borrowedCurrencyLimit = 2500;
	const borrowedCurrencySupply = 5000;

	const loanInfoItems = [
		{
			label: t('loans.dashboard.loan-info.interest-rate'),
			value: formatPercentage(INTEREST_RATE_PERCENT),
		},
		{
			label: t('loans.dashboard.loan-info.minting-fee'),
			value: formatPercentage(MINTING_FEE_PERCENT),
		},
		{
			label: t('loans.dashboard.loan-info.number-of-loans'),
			value: numberOfLoans,
		},
		{
			label: t('loans.dashboard.loan-info.currency-limit', { currencyKey: BORROWED_CURRENCY_KEY }),
			value: formatCurrency(borrowedCurrencySupply),
		},
		{
			label: t('loans.dashboard.loan-info.currency-supply', { currencyKey: BORROWED_CURRENCY_KEY }),
			value: formatCurrency(borrowedCurrencyLimit),
		},
		{
			label: t('loans.dashboard.loan-info.min-loan-size'),
			value: formatCurrencyWithKey(BORROWED_CURRENCY_KEY, MIN_LOAN_SIZE),
		},
		{
			label: t('loans.dashboard.loan-info.collateral-size'),
			value: formatPercentage(COLLAT_RATIO_PERCENT, 0),
		},
	];

	return (
		<>
			<Card>
				<Card.Header>
					<HeadingSmall>
						{t('loans.dashboard.title', { currencyKey: COLLATERAL_CURRENCY_KEY })}
					</HeadingSmall>
				</Card.Header>
				<Card.Body>
					<LoanInfoRow>
						{loanInfoItems.map(infoItem => (
							<InfoBox key={infoItem.label}>
								<InfoBoxLabel>{infoItem.label}</InfoBoxLabel>
								<InfoBoxValue>{infoItem.value}</InfoBoxValue>
							</InfoBox>
						))}
					</LoanInfoRow>
				</Card.Body>
			</Card>
			<Table cellPadding="0" cellPadding="0">
				<thead>
					<TableRowHeader>
						<th>{t('common.wallet.your-wallet')}</th>
						<th>{t('common.wallet.currency-balance', { currencyKey: BORROWED_CURRENCY_KEY })}</th>
						<th>{t('common.wallet.currency-balance', { currencyKey: COLLATERAL_CURRENCY_KEY })}</th>
						<th>{t('common.wallet.locked-currency', { currencyKey: COLLATERAL_CURRENCY_KEY })}</th>
					</TableRowHeader>
				</thead>
				<tbody>
					<tr>
						<td />
						<td>{formatCurrency(borrowedCurrencyBalance)}</td>
						<td>{formatCurrency(lockedCurrencyBalance)}</td>
						<td>{formatCurrency(lockedCurrencyLoanSize)}</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
};

Dashboard.propTypes = {
	gasInfo: PropTypes.object,
	ethRate: PropTypes.number,
	isInteractive: PropTypes.bool,
};

const LoanInfoRow = styled.div`
	display: grid;
	grid-column-gap: 12px;
	grid-auto-flow: column;
`;

const Table = styled.table`
	background-color: ${props => props.theme.colors.surfaceL2};
	border-collapse: collapse;
	width: 100%;
	font-size: 12px;
	tr {
		text-align: left;
		> * {
			color: ${props => props.theme.colors.fontPrimary};
			height: ${CARD_HEIGHT};
			text-align: left;
			&:first-child {
				padding-left: 18px;
			}
			&:last-child {
				text-align: right;
				padding-right: 18px;
			}
		}
		> th {
			&:not(:first-child) {
				color: ${props => props.theme.colors.fontTertiary};
			}
		}
	}
`;

const TableRowHeader = styled.tr`
	background-color: ${props => props.theme.colors.surfaceL3};
`;

const mapStateToProps = state => ({
	walletInfo: getWalletInfo(state),
});

export default connect(mapStateToProps, null)(Dashboard);
