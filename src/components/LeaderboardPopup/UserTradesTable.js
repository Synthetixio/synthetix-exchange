import React, { useState, useEffect, memo } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import snxData from 'synthetix-data';
import get from 'lodash/get';

import { formatCurrencyWithSign } from 'src/utils/formatters';

import { ReactComponent as ArrowLeftIcon } from 'src/assets/images/l2/arrow-left.svg';

import { getAvailableSynthsMap } from 'src/ducks/synths';

import Table from 'src/components/Table';
import { TABLE_PALETTE } from 'src/components/Table/constants';
import Currency from 'src/components/Currency';
import Tooltip from '@material-ui/core/Tooltip';
import Link from 'src/components/Link';

import { resetButtonCSS, textShadowCSS } from 'src/shared/commonStyles';
import { SYNTHS_MAP } from 'src/constants/currency';

import {
	LONG_CRYPTO_CURRENCY_DECIMALS,
	SHORT_CRYPTO_CURRENCY_DECIMALS,
	formatCurrencyWithKey,
	formatTxTimestamp,
	formatCurrency,
	formatCurrencyPair,
} from 'src/utils/formatters';

import { media } from 'src/shared/media';

const UserTradesTable = memo(({ selectedUser, onBackButton, synthsMap }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [trades, setTrades] = useState([]);

	useEffect(() => {
		const loadUserTrades = async () => {
			setIsLoading(true);
			const transactions = await snxData.exchanges.since({
				fromAddress: selectedUser.address,
			});

			const trades = transactions.map(tx => ({
				...tx,
				price:
					tx.toCurrencyKey === SYNTHS_MAP.sUSD
						? tx.fromAmountInUSD / tx.fromAmount
						: tx.toAmountInUSD / tx.toAmount,
				amount: tx.toCurrencyKey === SYNTHS_MAP.sUSD ? tx.fromAmountInUSD : tx.toAmountInUSD,
			}));

			setTrades(trades);

			setIsLoading(false);
		};

		loadUserTrades();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<Headline>
				<StyledLink to={`https://twitter.com/${selectedUser.twitterHandle}`} isExternal={true}>
					All trades by @{selectedUser.twitterHandle}
				</StyledLink>
			</Headline>
			<GoBackButton onClick={onBackButton}>
				<ArrowLeftIcon />
			</GoBackButton>
			<StyledTable
				palette={TABLE_PALETTE.STRIPED}
				columns={[
					{
						Header: 'DATE | TIME',
						accessor: 'timestamp',
						Cell: cellProps => formatTxTimestamp(cellProps.cell.value),
						sortable: true,
						width: 140,
					},
					{
						Header: 'PAIR',
						accessor: d => formatCurrencyPair(d.toCurrencyKey, d.fromCurrencyKey),
						Cell: cellProps => {
							const { fromCurrencyKey, toCurrencyKey } = cellProps.row.original;

							return (
								<Currency.Pair baseCurrencyKey={fromCurrencyKey} quoteCurrencyKey={toCurrencyKey} />
							);
						},
					},
					{
						Header: 'BUYING',
						accessor: 'toAmount',
						sortType: 'basic',
						sortable: true,
						Cell: cellProps => (
							<Tooltip
								title={formatCurrency(
									cellProps.row.original.toAmount,
									LONG_CRYPTO_CURRENCY_DECIMALS
								)}
								placement="top"
							>
								<span>
									{formatCurrencyWithKey(
										cellProps.row.original.toCurrencyKey,
										cellProps.row.original.toAmount,
										SHORT_CRYPTO_CURRENCY_DECIMALS
									)}
								</span>
							</Tooltip>
						),
					},
					{
						Header: 'SELLING',
						accessor: 'fromAmount',
						sortType: 'basic',
						sortable: true,
						Cell: cellProps => (
							<Tooltip
								title={formatCurrency(
									cellProps.row.original.fromAmount,
									LONG_CRYPTO_CURRENCY_DECIMALS
								)}
								placement="top"
							>
								<span>
									{formatCurrencyWithKey(
										cellProps.row.original.fromCurrencyKey,
										cellProps.row.original.fromAmount,
										SHORT_CRYPTO_CURRENCY_DECIMALS
									)}
								</span>
							</Tooltip>
						),
					},
					{
						Header: 'price',
						accessor: 'price',
						sortType: 'basic',
						width: 100,
						sortable: true,
						Cell: cellProps => (
							<span>
								{formatCurrencyWithSign(
									get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
									cellProps.cell.value
								)}
							</span>
						),
					},
					{
						Header: 'TOTAL',
						accessor: 'amount',
						sortType: 'basic',
						width: 130,
						sortable: true,
						Cell: cellProps => (
							<span>
								{formatCurrencyWithSign(
									get(synthsMap, [SYNTHS_MAP.sUSD, 'sign']),
									cellProps.cell.value
								)}
							</span>
						),
					},
				]}
				data={trades}
				isLoading={isLoading}
				noResultsMessage={
					!isLoading && trades.length === 0 ? (
						<NoResultsMessage>The user has no trades.</NoResultsMessage>
					) : undefined
				}
			/>
		</>
	);
});

const NoResultsMessage = styled.div`
	padding: 18px;
`;

const StyledTable = styled(Table)`
	.table-body {
		max-height: calc(100% - 32px);
	}
	.table-body-cell,
	.table-head-cell {
		height: 32px;
	}
	.table-head-cell {
		background: none;
	}
	${media.small`
		.table-body-row {
			height: 32px;
			margin: 0;
			border-radius: initial;
			border-left: 0;
			border-right: 0;
			border-bottom: 0;
			&:last-child {
				border-bottom: 0.5px solid #cb5bf2;
			}
		}
	`}
`;

const StyledLink = styled(Link)`
	color: ${props => props.theme.colors.fontPrimary};
`;

const Headline = styled.div`
	${textShadowCSS};
	font-family: ${props => props.theme.fonts.medium};
	font-weight: normal;
	font-size: 30px;
	text-align: center;
	padding-bottom: 35px;
	${media.small`
		max-width: 280px;
		font-size: 24px;
		line-height: 29px;
	`}
`;

const GoBackButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	left: 0;
	outline: none;
	svg {
		width: 25px;
		height: 25px;
	}
	${media.small`
		left: 5px;
	`}
`;

const mapStateToProps = state => ({
	synthsMap: getAvailableSynthsMap(state),
});

export default connect(mapStateToProps, null)(UserTradesTable);
