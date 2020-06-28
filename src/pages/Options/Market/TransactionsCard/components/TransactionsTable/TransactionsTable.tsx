import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';

import { SYNTHS_MAP, USD_SIGN } from 'constants/currency';

import { TableOverflowContainer, GridDivCenteredCol } from 'shared/commonStyles';
import { formatTxTimestamp, formatCurrencyWithKey } from 'utils/formatters';

import Table from 'components/Table';

import { OptionsTransaction, OptionsTransactions } from 'pages/Options/types';

import ViewLinkCell from 'pages/shared/components/ViewLinkCell';
import SideIcon from 'pages/Options/Market/components/SideIcon';

type TransactionsTableProps = {
	optionsTransactions: OptionsTransactions;
	noResultsMessage?: React.ReactNode;
	isLoading: boolean;
};

export const TransactionsTable: FC<TransactionsTableProps> = memo(
	({ optionsTransactions, noResultsMessage, isLoading }) => {
		const { t } = useTranslation();

		return (
			<StyledTableOverflowContainer>
				<StyledTable
					palette="striped"
					columns={[
						{
							Header: <>{t('options.market.transactions-card.table.date-time-col')}</>,
							accessor: 'timestamp',
							Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['timestamp']>) =>
								formatTxTimestamp(cellProps.cell.value),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('options.market.transactions-card.table.type-col')}</>,
							accessor: 'type',
							Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['type']>) => (
								<span>
									{t(`options.market.transactions-card.table.types.${cellProps.cell.value}`)}
								</span>
							),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('options.market.transactions-card.table.position-col')}</>,
							accessor: 'side',
							Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['side']>) => {
								const side = cellProps.cell.value;

								return (
									<Position>
										<SideIcon side={side} />
										<span>{side}</span>
									</Position>
								);
							},
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('options.market.transactions-card.table.amount-col')}</>,
							sortType: 'basic',
							accessor: 'amount',
							Cell: (cellProps: CellProps<OptionsTransaction, OptionsTransaction['amount']>) => (
								<span>{`${USD_SIGN}${formatCurrencyWithKey(
									SYNTHS_MAP.sUSD,
									cellProps.cell.value
								)}`}</span>
							),
							width: 150,
							sortable: true,
						},
						{
							Header: <>{t('options.market.transactions-card.table.tx-status-col')}</>,
							id: 'tx-status',
							Cell: (cellProps: CellProps<OptionsTransaction>) => (
								<ViewLinkCell hash={cellProps.cell.row.original.hash} />
							),
							width: 150,
						},
					]}
					data={optionsTransactions}
					isLoading={isLoading}
					noResultsMessage={noResultsMessage}
				/>
			</StyledTableOverflowContainer>
		);
	}
);

const StyledTableOverflowContainer = styled(TableOverflowContainer)`
	height: 100%;
`;

const StyledTable = styled(Table)`
	.table-row,
	.table-body-row {
		& > :last-child {
			justify-content: flex-end;
		}
	}
`;

const Position = styled(GridDivCenteredCol)`
	grid-gap: 8px;
	text-transform: uppercase;
`;

export default TransactionsTable;
