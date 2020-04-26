import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAvailableSynthsMap } from 'ducks/synths';
import { navigateToTrade } from 'constants/routes';

import { TableOverflowContainer } from 'shared/commonStyles';

import ChangePercent from 'components/ChangePercent';
import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';
import { CurrencyCol, NullableCell } from 'components/Table/common';

import Currency from 'components/Currency';

export const MarketsTable = memo(({ markets, synthsMap, marketsLoaded, noResultsMessage }) => {
	const { t } = useTranslation();

	return (
		<TableOverflowContainer>
			<Table
				palette={TABLE_PALETTE.LIGHT}
				columns={[
					{
						Header: t('markets.table.pair-col'),
						accessor: 'pair',
						Cell: (cellProps) => (
							<Currency.Pair
								baseCurrencyKey={cellProps.row.original.baseCurrencyKey}
								quoteCurrencyKey={cellProps.row.original.quoteCurrencyKey}
								showIcon={true}
							/>
						),
						width: 150,
						sortable: true,
					},
					{
						Header: t('markets.table.last-price-col'),
						accessor: 'lastPrice',
						Cell: (cellProps) => (
							<CurrencyCol
								currencyKey={cellProps.row.original.quoteCurrencyKey}
								synthsMap={synthsMap}
								cellProps={cellProps}
							/>
						),
						width: 150,
						sortable: true,
					},
					{
						Header: t('markets.table.24h-change-col'),
						accessor: 'rates24hChange',
						Cell: (cellProps) => (
							<NullableCell cellProps={cellProps}>
								{cellProps.cell.value != null && (
									<ChangePercent isLabel={true} value={cellProps.cell.value} />
								)}
							</NullableCell>
						),
						width: 150,
						sortable: true,
					},
					{
						Header: t('markets.table.24h-low-col'),
						accessor: 'rates24hLow',
						Cell: (cellProps) => (
							<CurrencyCol
								currencyKey={cellProps.row.original.quoteCurrencyKey}
								synthsMap={synthsMap}
								cellProps={cellProps}
							/>
						),
						width: 150,
						sortable: true,
					},
					{
						Header: t('markets.table.24h-high-col'),
						accessor: 'rates24hHigh',
						Cell: (cellProps) => (
							<CurrencyCol
								currencyKey={cellProps.row.original.quoteCurrencyKey}
								synthsMap={synthsMap}
								cellProps={cellProps}
							/>
						),
						width: 150,
						sortable: true,
					},
					{
						Header: t('markets.table.24h-volume-col'),
						accessor: 'rates24hVol',
						Cell: (cellProps) => (
							<CurrencyCol
								currencyKey={cellProps.row.original.quoteCurrencyKey}
								synthsMap={synthsMap}
								cellProps={cellProps}
							/>
						),
						width: 150,
						sortable: true,
					},
				]}
				columnsDeps={[synthsMap]}
				data={markets}
				onTableRowClick={(row) =>
					navigateToTrade(row.original.baseCurrencyKey, row.original.quoteCurrencyKey)
				}
				options={{
					initialState: {
						sortBy: marketsLoaded ? [{ id: 'rates24hVol', desc: true }] : [],
					},
				}}
				noResultsMessage={noResultsMessage}
			/>
		</TableOverflowContainer>
	);
});

MarketsTable.propTypes = {
	markets: PropTypes.array.isRequired,
	synthsMap: PropTypes.object,
	marketsLoaded: PropTypes.bool,
	noResultsMessage: PropTypes.string,
};

const mapStateToProps = (state) => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect(mapStateToProps, null)(MarketsTable);
