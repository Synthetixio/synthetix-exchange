import React, { memo } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { CRYPTO_CURRENCY_MAP } from 'src/constants/currency';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import Currency from 'src/components/Currency';
import Card from 'src/components/Card';
import Link from 'src/components/Link';
import { HeadingSmall } from 'src/components/Typography';
import { ButtonPrimary } from 'src/components/Button';

import { getEtherscanTxLink } from 'src/utils/explorers';
import { formatTxTimestamp, formatCurrency } from 'src/utils/formatters';

import { getNetworkId } from 'src/ducks';

const MOCK_TRANSFERS = [
	{
		time: Date.now(),
		currencyKey: CRYPTO_CURRENCY_MAP.ETH,
		status: 'in',
		txid: '0x327632ccb6d7bb47b455383e936b2f14e6dc50dbefdc214870b446603b468675',
		amount: 2000000,
	},
];

export const Transfers = memo(({ transfers = MOCK_TRANSFERS, networkId }) => {
	const { t } = useTranslation();

	return (
		<Card>
			<Card.Header>
				<HeadingSmall>{t('assets.transfers.title')}</HeadingSmall>
			</Card.Header>
			<StyledCardBody>
				<Table
					palette={TABLE_PALETTE.STRIPED}
					columns={[
						{
							Header: t('assets.transfers.table.date-time-col'),
							accessor: 'time',
							Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
							width: 150,
							sortable: true,
						},
						{
							Header: t('assets.transfers.table.asset-col'),
							accessor: 'currencyKey',
							Cell: cellProps => (
								<Currency.Name currencyKey={cellProps.cell.value} showIcon={true} />
							),
							width: 150,
						},
						{
							Header: t('assets.transfers.table.total-col'),
							accessor: 'amount',
							Cell: cellProps => <span>{formatCurrency(cellProps.cell.value)}</span>,
							width: 150,
							sortable: true,
						},
						{
							Header: t('assets.transfers.table.status-col'),
							accessor: 'status',
							Cell: cellProps => t(`common.tx-status.${cellProps.cell.value}`),
							width: 150,
							sortable: true,
						},
						{
							Header: t('assets.transfers.table.verify-col'),
							accessor: 'actions',
							Cell: cellProps => (
								<Link
									to={getEtherscanTxLink(networkId, cellProps.row.original.txid)}
									isExternal={true}
								>
									<ButtonPrimary size="xs">{t('common.actions.view')}</ButtonPrimary>
								</Link>
							),
						},
					]}
					data={transfers}
				/>
			</StyledCardBody>
		</Card>
	);
});

Transfers.propTypes = {
	transfers: PropTypes.array,
	networkId: PropTypes.string.isRequired,
};

const StyledCardBody = styled(Card.Body)`
	padding: 0;
`;

const mapStateToProps = state => ({
	networkId: getNetworkId(state),
});

export default connect(mapStateToProps, null)(Transfers);
