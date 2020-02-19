import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import snxJSConnector from '../../../../utils/snxJSConnector';

import Card from '../../../../components/Card';
import { HeadingSmall } from '../../../../components/Typography';
import { getWalletInfo } from '../../../../ducks';

import { getCurrencyKeyBalance } from '../../../../utils/balances';
import {
	formatPercentage,
	formatCurrency,
	formatCurrencyWithKey,
	bigNumberFormatter,
} from '../../../../utils/formatters';

import { CARD_HEIGHT } from '../../../../constants/ui';

import { InfoBox, InfoBoxLabel, InfoBoxValue, CurrencyKey } from '../../../../shared/commonStyles';
import { EMPTY_BALANCE } from '../../../../constants/placeholder';

export const Dashboard = ({ walletInfo: { balances, currentWallet }, collateralPair }) => {
	const [lockedCollateralAmount, setLockedCollateralAmount] = useState(null);

	const { t } = useTranslation();

	const {
		collateralCurrencyKey,
		loanCurrencyKey,
		interestRatePercent,
		issueFeeRatePercent,
		totalOpenLoanCount,
		minLoanSize,
		collateralizationRatioPercent,
		issueLimit,
		totalIssuedSynths,
	} = collateralPair;

	const loanInfoItems = [
		{
			label: t('loans.dashboard.loan-info.interest-rate'),
			value: formatPercentage(interestRatePercent),
		},
		{
			label: t('loans.dashboard.loan-info.minting-fee'),
			value: formatPercentage(issueFeeRatePercent),
		},
		{
			label: t('loans.dashboard.loan-info.number-of-open-loans'),
			value: totalOpenLoanCount,
		},
		{
			label: (
				<Trans
					i18nKey="loans.dashboard.loan-info.currency-limit"
					values={{ currencyKey: loanCurrencyKey }}
					components={[<CurrencyKey />]}
				/>
			),
			value: formatCurrency(issueLimit),
		},
		{
			label: (
				<Trans
					i18nKey="loans.dashboard.loan-info.currency-supply"
					values={{ currencyKey: loanCurrencyKey }}
					components={[<CurrencyKey />]}
				/>
			),

			value: formatCurrency(totalIssuedSynths),
		},
		{
			label: t('loans.dashboard.loan-info.min-loan-size'),
			value: formatCurrencyWithKey(loanCurrencyKey, minLoanSize),
		},
		{
			label: t('loans.dashboard.loan-info.collateral-size'),
			value: formatPercentage(collateralizationRatioPercent, 0),
		},
	];

	useEffect(() => {
		const getLockedETHBalance = async () => {
			if (currentWallet) {
				const balance = await snxJSConnector.provider.getBalance(
					await snxJSConnector.snxJS.EtherCollateral.contract.address
				);
				setLockedCollateralAmount(bigNumberFormatter(balance));
			}
		};
		getLockedETHBalance();
	}, [currentWallet]);

	return (
		<>
			<Card>
				<Card.Header>
					<HeadingSmall>
						{t('loans.dashboard.title', { currencyKey: collateralCurrencyKey })}
					</HeadingSmall>
				</Card.Header>
				<Card.Body>
					<LoanInfoRow>
						{loanInfoItems.map((infoItem, idx) => (
							<InfoBox key={`loanInfo${idx}`}>
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
						<th>{t('common.wallet.currency-balance', { currencyKey: loanCurrencyKey })}</th>
						<th>
							{t('common.wallet.currency-balance', {
								currencyKey: collateralCurrencyKey,
							})}
						</th>
						<th>{t('common.wallet.locked-currency', { currencyKey: collateralCurrencyKey })}</th>
					</TableRowHeader>
				</thead>
				<tbody>
					<tr>
						<td />
						<td>
							{currentWallet
								? formatCurrency(getCurrencyKeyBalance(balances, loanCurrencyKey))
								: EMPTY_BALANCE}
						</td>
						<td>
							{currentWallet
								? formatCurrency(getCurrencyKeyBalance(balances, collateralCurrencyKey))
								: EMPTY_BALANCE}
						</td>
						<td>
							{lockedCollateralAmount != null
								? formatCurrency(lockedCollateralAmount)
								: EMPTY_BALANCE}
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
};

Dashboard.propTypes = {
	walletInfo: PropTypes.object,
	collateralPair: PropTypes.object,
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
