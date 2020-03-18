import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import get from 'lodash/get';

import PropTypes from 'prop-types';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import Currency from 'src/components/Currency';
import Card from 'src/components/Card';
import { HeadingSmall } from 'src/components/Typography';
import { ButtonPrimary } from 'src/components/Button';
import Link from 'src/components/Link';

import { formatCurrency, formatCurrencyWithSign } from 'src/utils/formatters';

import { getAvailableSynthsMap } from 'src/ducks/synths';
import { getSynthsWalletBalances, getIsRefreshingWalletBalances } from 'src/ducks/wallet';

import { CRYPTO_CURRENCY_MAP, SYNTHS_MAP } from 'src/constants/currency';
import { LINKS } from 'src/constants/links';
import Spinner from 'src/components/Spinner';

export const YourAssets = memo(
	({ synthsWalletBalances, isRefreshingWalletBalances, synthsMap }) => {
		const { t } = useTranslation();

		return (
			<Card>
				<Card.Header>
					<HeadingSmall>{t('assets.overview.your-assets.title')}</HeadingSmall>
					{isRefreshingWalletBalances && <Spinner size="sm" />}
				</Card.Header>
				<StyledCardBody>
					<Table
						palette={TABLE_PALETTE.STRIPED}
						columns={[
							{
								Header: t('assets.overview.your-assets.table.asset-col'),
								accessor: 'name',
								Cell: cellProps => (
									<Currency.Name currencyKey={cellProps.cell.value} showIcon={true} />
								),
								width: 150,
								sortable: true,
							},
							{
								Header: t('assets.overview.your-assets.table.asset-description-col'),
								id: 'asset-desc',
								Cell: cellProps => {
									const currencyKey = cellProps.row.original.name;
									return <span>{get(synthsMap, [currencyKey, 'desc'])}</span>;
								},
								width: 150,
							},
							{
								Header: t('assets.overview.your-assets.table.total-col'),
								accessor: 'balance',
								Cell: cellProps => formatCurrency(cellProps.cell.value, 4),
								width: 150,
								sortable: true,
							},
							{
								Header: t('assets.overview.your-assets.table.usd-value-col'),
								accessor: 'usdBalance',
								Cell: cellProps => (
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
								Header: t('assets.overview.your-assets.table.actions-col'),
								accessor: 'actions',
								width: 250,
								Cell: cellProps => {
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
					/>
				</StyledCardBody>
			</Card>
		);
	}
);

const ActionsCol = styled.div`
	display: inline-grid;
	grid-gap: 11px;
	grid-auto-flow: column;
`;

const StyledCardBody = styled(Card.Body)`
	padding: 0;
`;

YourAssets.propTypes = {
	synthsMap: PropTypes.object,
	synthsWalletBalances: PropTypes.array.isRequired,
	isRefreshingWalletBalances: PropTypes.bool,
};

const mapStateToProps = state => ({
	synthsMap: getAvailableSynthsMap(state),
	synthsWalletBalances: getSynthsWalletBalances(state),
	isRefreshingWalletBalances: getIsRefreshingWalletBalances(state),
});

export default connect(mapStateToProps, null)(YourAssets);
