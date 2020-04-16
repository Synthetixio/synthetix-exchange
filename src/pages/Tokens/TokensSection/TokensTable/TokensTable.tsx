import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { getAvailableSynths, SynthDefinition } from 'ducks/synths';

import Table from 'components/Table';
import { TABLE_PALETTE } from 'components/Table/constants';

import Currency from 'components/Currency';
import { RootState } from 'ducks/types';

interface StateProps {
	synths: SynthDefinition[];
}

type TokensTableProps = StateProps;

export const TokensTable: FC<TokensTableProps> = memo(({ synths }) => {
	const { t } = useTranslation();

	return (
		// @ts-ignore
		<Table
			palette={TABLE_PALETTE.LIGHT}
			columns={[
				{
					Header: t('tokens.table.token-col'),
					accessor: 'name',
					Cell: (cellProps: any) => (
						<Currency.Name
							// @ts-ignore
							currencyKey={cellProps.cell.value}
							currencyDesc={cellProps.row.original.desc}
							showIcon={true}
						/>
					),
					width: 150,
					sortable: true,
				},
				{
					Header: t('tokens.table.last-price-col'),
					accessor: 'lastPrice',
					Cell: () => <span>1.0000</span>,
					width: 150,
					sortable: true,
				},
			]}
			data={synths}
		/>
	);
});

const mapStateToProps = (state: RootState): StateProps => ({
	synths: getAvailableSynths(state),
});

export default connect<StateProps, {}, {}, RootState>(mapStateToProps)(TokensTable);
