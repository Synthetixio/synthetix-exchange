import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';

import Card from 'components/Card';
import { HeadingSmall } from 'components/Typography';
import { getIsRefreshingLoansContractInfo } from 'ducks/loans/contractInfo';
import { getIsFetchingWalletBalances } from 'ducks/wallet/walletBalances';
import { getWalletInfo, getNetworkId } from 'ducks/wallet/walletDetails';

import { getCurrencyKeyBalance } from 'utils/balances';
import { formatPercentage, formatCurrency, formatCurrencyWithKey } from 'utils/formatters';

import { CARD_HEIGHT } from 'constants/ui';

import {
	InfoBox,
	InfoBoxLabel,
	InfoBoxValue,
	CurrencyKey,
	ExternalLink,
} from 'shared/commonStyles';
import { EMPTY_VALUE } from 'constants/placeholder';
import Spinner from 'components/Spinner';

import snxJSConnector from 'utils/snxJSConnector';
import { getEtherscanAddressLink } from 'utils/explorers';

export const Dashboard = ({
	walletInfo: { balances, currentWallet },
	collateralPair,
	isFetchingWalletBalances,
	isRefreshingLoansContractInfo,
	networkId,
}) => {
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
		lockedCollateralAmount,
	} = collateralPair;

	const {
		snxJS: { EtherCollateral },
	} = snxJSConnector;

	const loanInfoItems = [
		{
			label: t('loans.dashboard.loan-info.interest-fee'),
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
			value: formatCurrencyWithKey(collateralCurrencyKey, minLoanSize),
		},
		{
			label: t('loans.dashboard.loan-info.collateral-size'),
			value: formatPercentage(collateralizationRatioPercent, 0),
		},
		{
			label: t('loans.dashboard.loan-info.locked-currency', {
				currencyKey: collateralCurrencyKey,
			}),
			value: formatCurrency(lockedCollateralAmount, 0),
		},
	];

	return (
		<>
			<Card>
				<Card.Header>
					<HeadingSmall>
						{t('loans.dashboard.title', { currencyKey: collateralCurrencyKey })}
					</HeadingSmall>
					{isRefreshingLoansContractInfo && <Spinner size="sm" />}
					<StyledExternalLink
						href={getEtherscanAddressLink(networkId, EtherCollateral.contract.address)}
					>
						{t('common.contracts.view')}
						<StyledArrowHyperlinkIcon width="8" height="8" />
					</StyledExternalLink>
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
			<Table cellSpacing="0" cellPadding="0">
				<thead>
					<TableRowHeader>
						<WalletBalancesHeading>
							<span>{t('common.wallet.your-wallet')}</span>
							{isFetchingWalletBalances && <Spinner size="sm" />}
						</WalletBalancesHeading>
						<th>{t('common.wallet.currency-balance', { currencyKey: loanCurrencyKey })}</th>
						<th>
							{t('common.wallet.currency-balance', {
								currencyKey: collateralCurrencyKey,
							})}
						</th>
					</TableRowHeader>
				</thead>
				<tbody>
					<tr>
						<td style={{ width: '60%' }} />
						<td>
							{currentWallet
								? formatCurrency(getCurrencyKeyBalance(balances, loanCurrencyKey))
								: EMPTY_VALUE}
						</td>
						<td>
							{currentWallet
								? formatCurrency(getCurrencyKeyBalance(balances, collateralCurrencyKey))
								: EMPTY_VALUE}
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	);
};

Dashboard.propTypes = {
	walletInfo: PropTypes.object.isRequired,
	collateralPair: PropTypes.object.isRequired,
	isFetchingWalletBalances: PropTypes.bool.isRequired,
	isRefreshingLoansContractInfo: PropTypes.bool.isRequired,
	networkId: PropTypes.string.isRequired,
};

const StyledExternalLink = styled(ExternalLink)`
	color: ${props => props.theme.colors.hyperlink};
	text-transform: none;
	margin-left: auto;
	font-size: 13px;
`;

const StyledArrowHyperlinkIcon = styled(ArrowHyperlinkIcon)`
	margin-left: 5px;
`;

const WalletBalancesHeading = styled.th`
	width: 60%;
	display: flex;
	align-items: center;

	> * + * {
		margin-left: 10px;
	}
`;

const LoanInfoRow = styled.div`
	display: grid;
	grid-column-gap: 12px;
	grid-auto-flow: column;
	@media (max-width: 1480px) {
		grid-template-rows: auto auto;
		grid-row-gap: 10px;
	}
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
	networkId: getNetworkId(state),
	walletInfo: getWalletInfo(state),
	isFetchingWalletBalances: getIsFetchingWalletBalances(state),
	isRefreshingLoansContractInfo: getIsRefreshingLoansContractInfo(state),
});

export default connect(mapStateToProps, null)(Dashboard);
