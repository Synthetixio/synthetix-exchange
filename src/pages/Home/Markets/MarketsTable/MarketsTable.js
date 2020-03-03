import React, { memo } from 'react';
import { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigateToTrade } from '../../../../constants/routes';

import { EMPTY_BALANCE } from '../../../../constants/placeholder';
import ChangePercent from '../../../../components/ChangePercent';
import TableV2 from '../../../../components/TableV2';

import { lightTheme } from '../../../../styles/theme';

import { formatCurrencyWithSign, formatCurrencyPair } from '../../../../utils/formatters';

const CurrencyCol = (synthsMap, cellProps) => {
	const quoteCurrencyKey = cellProps.row.original.quoteCurrencyKey;
	const sign = synthsMap[quoteCurrencyKey] && synthsMap[quoteCurrencyKey].sign;

	return <span>{formatCurrencyWithSign(sign, cellProps.cell.value)}</span>;
};

export const MarketsTable = memo(({ synthsRates, synthsMap }) => {
	const { t } = useTranslation();

	return (
		<ThemeProvider theme={lightTheme}>
			<TableV2
				columns={[
					{
						Header: t('home.markets.table.pair-col'),
						accessor: d => formatCurrencyPair(d.baseCurrencyKey, d.quoteCurrencyKey),
						Cell: cellProps => cellProps.cell.value,
						width: 150,
						sortable: true,
					},
					{
						Header: t('home.markets.table.last-price-col'),
						accessor: 'lastPrice',
						Cell: cellProps =>
							cellProps.cell.value == EMPTY_BALANCE
								? EMPTY_BALANCE
								: CurrencyCol(synthsMap, cellProps),
						width: 150,
						sortable: true,
					},
					{
						Header: t('home.markets.table.24h-change-col'),
						accessor: 'rates24hChange',
						Cell: cellProps => <ChangePercent value={cellProps.cell.value} />,
						width: 150,
						sortable: true,
					},
					{
						Header: t('home.markets.table.24h-low-col'),
						accessor: 'rates24hLow',
						Cell: cellProps => CurrencyCol(synthsMap, cellProps),
						width: 150,
						sortable: true,
					},
					{
						Header: t('home.markets.table.24h-high-col'),
						accessor: 'rates24hHigh',
						Cell: cellProps => CurrencyCol(synthsMap, cellProps),
						width: 150,
						sortable: true,
					},
					{
						Header: t('home.markets.table.24h-volume-col'),
						accessor: 'rates24hVol',
						Cell: cellProps => CurrencyCol(synthsMap, cellProps),
						width: 150,
						sortable: true,
					},
				]}
				data={synthsRates}
				onTableRowClick={row =>
					navigateToTrade(row.original.baseCurrencyKey, row.original.quoteCurrencyKey)
				}
			/>
		</ThemeProvider>
	);
});

MarketsTable.propTypes = {
	synthsRates: PropTypes.array.isRequired,
	synthsMap: PropTypes.object,
};

export default MarketsTable;
