import React, { memo } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { navigateToTrade, navigateTo, ROUTES } from 'src/constants/routes';

import { EMPTY_VALUE } from 'src/constants/placeholder';
import ChangePercent from 'src/components/ChangePercent';
import TableV2 from 'src/components/TableV2';
import { TABLE_PALETTE } from 'src/components/TableV2/constants';
import Currency from 'src/components/Currency';
import { ButtonPrimary } from 'src/components/Button';

import { lightTheme } from 'src/styles/theme';

import { formatCurrencyWithSign } from 'src/utils/formatters';

const NullableCell = ({ cellProps, children }) =>
	cellProps.cell.value == null ? <span>{EMPTY_VALUE}</span> : children;

const CurrencyCol = ({ synthsMap, cellProps }) => {
	const quoteCurrencyKey = cellProps.row.original.quoteCurrencyKey;
	const sign = synthsMap[quoteCurrencyKey] && synthsMap[quoteCurrencyKey].sign;

	return (
		<NullableCell cellProps={cellProps}>
			<span>{formatCurrencyWithSign(sign, cellProps.cell.value)}</span>
		</NullableCell>
	);
};

export const MarketsTable = memo(({ markets, synthsMap }) => {
	const { t } = useTranslation();

	return (
		<ThemeProvider theme={lightTheme}>
			<TableV2
				palette={TABLE_PALETTE.LIGHT_SECONDARY}
				columns={[
					{
						Header: t('home.markets.table.pair-col'),
						accessor: 'pair',
						Cell: cellProps => (
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
						Header: t('home.markets.table.last-price-col'),
						accessor: 'lastPrice',
						Cell: cellProps => <CurrencyCol synthsMap={synthsMap} cellProps={cellProps} />,
						width: 150,
						sortable: true,
					},
					{
						Header: t('home.markets.table.24h-change-col'),
						accessor: 'rates24hChange',
						Cell: cellProps => (
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
						Header: t('home.markets.table.24h-low-col'),
						accessor: 'rates24hLow',
						Cell: cellProps => <CurrencyCol synthsMap={synthsMap} cellProps={cellProps} />,
						width: 150,
						sortable: true,
					},
					{
						Header: t('home.markets.table.24h-high-col'),
						accessor: 'rates24hHigh',
						Cell: cellProps => <CurrencyCol synthsMap={synthsMap} cellProps={cellProps} />,
						width: 150,
						sortable: true,
					},
					{
						Header: t('home.markets.table.24h-volume-col'),
						accessor: 'rates24hVol',
						Cell: cellProps => <CurrencyCol synthsMap={synthsMap} cellProps={cellProps} />,
						width: 150,
						sortable: true,
					},
				]}
				data={markets}
				onTableRowClick={row =>
					navigateToTrade(row.original.baseCurrencyKey, row.original.quoteCurrencyKey)
				}
				options={{
					initialState: {
						sortBy: [{ id: 'rates24hVol', desc: true }],
					},
				}}
			/>
			<ButtonContainer>
				<StyledButtonPrimary onClick={() => navigateTo(ROUTES.Trade)}>
					{t('home.markets.table.actions.see-all-pairs')}
				</StyledButtonPrimary>
			</ButtonContainer>
		</ThemeProvider>
	);
});

const ButtonContainer = styled.div`
	padding: 75px 0;
	text-align: center;
`;

const StyledButtonPrimary = styled(ButtonPrimary)`
	padding: 0 70px;
	width: auto;
`;

MarketsTable.propTypes = {
	markets: PropTypes.array.isRequired,
	synthsMap: PropTypes.object,
};

export default MarketsTable;
