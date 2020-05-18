import React, { memo, FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { MarketPairs, MarketPair } from 'ducks/markets';
import { getAvailableSynthsMap } from 'ducks/synths';

import Currency from 'components/Currency';
import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';
import { CurrencyCol, RightAlignedCell } from 'components/Table/common';
import { SynthDefinitionMap } from 'ducks/synths';
import { connect } from 'react-redux';
import { RootState } from 'ducks/types';

type StateProps = {
	synthsMap: SynthDefinitionMap;
};

type Props = {
	markets: MarketPairs;
	onTableRowClick: (row: { original: MarketPair }) => void;
};

type MarketsTableProps = StateProps & Props;

const MarketsTable: FC<MarketsTableProps> = memo(({ synthsMap, markets, onTableRowClick }) => {
	const { t } = useTranslation();

	return (
		<StyledTable<any>
			palette={TABLE_PALETTE.PRIMARY}
			columns={[
				{
					Header: t('markets.table.pair-col'),
					accessor: 'pair',
					width: 150,
					Cell: (cellProps: { row: { original: MarketPair } }) => (
						<Currency.Pair
							baseCurrencyKey={cellProps.row.original.baseCurrencyKey}
							quoteCurrencyKey={cellProps.row.original.quoteCurrencyKey}
							showIcon={true}
						/>
					),
					sortable: true,
				},
				{
					Header: t('markets.table.last-price-col'),
					accessor: 'lastPrice',
					sortType: 'basic',
					width: 100,
					Cell: (cellProps: { row: { original: MarketPair } }) => (
						<RightAlignedCell>
							<CurrencyCol
								currencyKey={cellProps.row.original.quoteCurrencyKey}
								synthsMap={synthsMap}
								cellProps={cellProps}
							/>
						</RightAlignedCell>
					),
					sortable: true,
				},
			]}
			data={markets}
			onTableRowClick={onTableRowClick}
		/>
	);
});

const StyledTable = styled(Table)`
	.table-row {
		width: 100%;
		& > :last-child {
			justify-content: flex-end;
		}
	}
	.table-body {
		width: 300px;
		margin-bottom: 80px;
	}
	.table-body-row {
		margin: 0 6px 8px 6px;
		& > :first-child {
			padding-left: 12px;
		}
		& > :last-child {
			padding-right: 16px;
		}
	}
	.table-body-cell {
		height: 32px;
	}
`;

const mapStateToProps = (state: RootState): StateProps => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect<StateProps, undefined, Props, RootState>(mapStateToProps)(MarketsTable);
