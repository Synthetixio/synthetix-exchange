import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';

import get from 'lodash/get';

import PropTypes from 'prop-types';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import Currency from 'src/components/Currency';
import Card from 'src/components/Card';
import { HeadingSmall } from 'src/components/Typography';
import { ButtonPrimary } from 'src/components/Button';
import Link from 'src/components/Link';

import { TableNoResults } from 'src/shared/commonStyles';

import {
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
	formatCurrency,
	formatCurrencyWithSign,
} from 'src/utils/formatters';

import { getAvailableSynthsMap } from 'src/ducks/synths';
import {
	getSynthsWalletBalances,
	getIsRefreshingWalletBalances,
	getIsLoadedWalletBalances,
	getIsFetchingWalletBalances,
} from 'src/ducks/wallet/walletBalances';

import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'src/constants/currency';
import { LINKS } from 'src/constants/links';
import Spinner from 'src/components/Spinner';

export const YourSynths = memo(
	({
		synthsWalletBalances,
		isLoadedWalletBalances,
		isRefreshingWalletBalances,
		isFetchingWalletBalances,
		synthsMap,
	}) => {
		const { t } = useTranslation();

		return (
			<StyledCard>
				<Card.Header>
					<HeadingSmall>{t('assets.overview.your-synths.title')}</HeadingSmall>
					{isRefreshingWalletBalances && <Spinner size="sm" />}
				</Card.Header>
				<StyledCardBody>
					<Table
						palette={TABLE_PALETTE.STRIPED}
						columns={[
							{
								Header: t('assets.overview.your-synths.table.asset-col'),
								accessor: 'name',
								Cell: (cellProps) => (
									<Currency.Name currencyKey={cellProps.cell.value} showIcon={true} />
								),
								width: 150,
								sortable: true,
							},
							{
								Header: t('assets.overview.your-synths.table.asset-description-col'),
								id: 'asset-desc',
								Cell: (cellProps) => {
									const currencyKey = cellProps.row.original.name;

									return (
										<span>
											{t('common.currency.synthetic-currency', {
												currencyKey: get(synthsMap, [currencyKey, 'desc']),
											})}
										</span>
									);
								},
								width: 150,
							},
							{
								Header: t('assets.overview.your-synths.table.total-col'),
								accessor: 'balance',
								Cell: (cellProps) => (
									<Tooltip
										title={formatCurrency(cellProps.cell.value, LONG_CRYPTO_CURRENCY_DECIMALS)}
										placement="top"
									>
										<span>
											{formatCurrency(cellProps.cell.value, SHORT_CRYPTO_CURRENCY_DECIMALS)}
										</span>
									</Tooltip>
								),
								width: 150,
								sortable: true,
							},
							{
								Header: t('assets.overview.your-synths.table.usd-value-col'),
								accessor: 'usdBalance',
								Cell: (cellProps) => (
									<span>
										{formatCurrencyWithSign(
											get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
											cellProps.cell.value
										)}
									</span>
								),
								width: 150,
								sortable: true,
							},
							{
								Header: t('assets.overview.your-synths.table.actions-col'),
								accessor: 'actions',
								width: 250,
								Cell: (cellProps) => {
									const currencyKey = cellProps.row.original.name;

									return (
										<ActionsCol>
											<Link to={LINKS.Tokens} isExternal={true}>
												<ButtonPrimary size="xs" disabled={true}>
													{t('common.actions.info')}
												</ButtonPrimary>
											</Link>
											<ButtonPrimary size="xs" disabled={true}>
												{t('common.actions.trade')}
											</ButtonPrimary>
											{[SYNTHS_MAP.sUSD, SYNTHS_MAP.sETH].includes(currencyKey) && (
												<Link
													to={LINKS.Trading.OneInchLink(currencyKey, CRYPTO_CURRENCY_MAP.ETH)}
													isExternal={true}
												>
													<ButtonPrimary size="xs">
														{t('common.actions.swap-via-1inch')}
													</ButtonPrimary>
												</Link>
											)}
										</ActionsCol>
									);
								},
							},
						]}
						data={synthsWalletBalances}
						noResultsMessage={
							isLoadedWalletBalances && synthsWalletBalances.length === 0 ? (
								<TableNoResults>{t('assets.overview.your-synths.table.no-results')}</TableNoResults>
							) : undefined
						}
						isLoading={isFetchingWalletBalances && !isLoadedWalletBalances}
					/>
				</StyledCardBody>
			</StyledCard>
		);
	}
);

YourSynths.propTypes = {
	synthsMap: PropTypes.object,
	synthsWalletBalances: PropTypes.array.isRequired,
	isRefreshingWalletBalances: PropTypes.bool,
	isFetchingWalletBalances: PropTypes.bool,
	isLoadedWalletBalances: PropTypes.bool,
};

const ActionsCol = styled.div`
	display: inline-grid;
	grid-gap: 11px;
	grid-auto-flow: column;
`;

const StyledCard = styled(Card)`
	flex-grow: 1;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
	flex-grow: 1;
	position: relative;
`;

const mapStateToProps = (state) => ({
	synthsMap: getAvailableSynthsMap(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
	isRefreshingWalletBalances: getIsRefreshingWalletBalances(state),
	isFetchingWalletBalances: getIsFetchingWalletBalances(state),
	isLoadedWalletBalances: getIsLoadedWalletBalances(state),
});

export default connect(mapStateToProps, null)(YourSynths);
