import React from 'react';
import { useTranslation } from 'react-i18next';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';

const Trades = () => {
	const { t } = useTranslation();
	return (
		<Table
			palette={TABLE_PALETTE.STRIPED}
			columns={[
				{
					Header: t('trade.order-book-card.table.date'),
					accessor: 'date',
					Cell: cellProps => <div />,
					width: 150,
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.pair'),
					accessor: 'pair',
					Cell: cellProps => <div />,
					width: 150,
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.buying'),
					accessor: 'buying',
					Cell: cellProps => <div />,
					width: 150,
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.selling'),
					accessor: 'selling',
					Cell: cellProps => <div />,
					width: 150,
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.price'),
					accessor: 'price',
					Cell: cellProps => <div />,
					width: 150,
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.total'),
					accessor: 'total',
					Cell: cellProps => <div />,
					width: 150,
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.status'),
					accessor: 'status',
					Cell: cellProps => <div />,
					width: 150,
					sortable: true,
				},
				{
					Header: t('trade.order-book-card.table.verify'),
					Cell: cellProps => <div />,
					width: 150,
				},
			]}
		></Table>
	);
};

export default Trades;
