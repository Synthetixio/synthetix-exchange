/*  eslint-disable */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import orderBy from 'lodash/orderBy';

import { getAvailableSynths } from 'src/ducks/synths';
import { getTotalWalletBalanceUSD, getWalletBalances, getIsFetchingWalletBalances } from 'src';

import { HeadingSmall, DataSmall, LabelSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../deprecated/Table';
import { ButtonSort } from '../Button';
import Spinner from '../Spinner';
import Currency from '../Currency';

import { getWalletInfo } from 'src/ducks';
import { setSynthSearch } from 'src/ducks/ui';
import { formatCurrency } from 'src/utils/formatters';
import { CRYPTO_CURRENCY_MAP } from 'src/constants/currency';

const sortBy = (assets, column, isAscending) => {
	return orderBy(assets, column, [isAscending ? 'asc' : 'desc']);
};

const WalletBox = ({
	synths,
	theme: { colors },
	walletInfo: { currentWallet },
	setSynthSearch,
	isFetchingWalletBalances,
	totalWalletBalanceUSD,
	walletBalances,
}) => {
	const [assets, setAssets] = useState([]);
	const [sortIsAcending, setSortIsAscending] = useState(true);

	useEffect(() => {
		setAssets(walletBalances);
	}, [walletBalances, currentWallet]);

	return (
		<Container>
			<Header>
				<HeaderBlock>
					<HeadingAndSpinner>
						<HeadingSmall>Wallet Balance</HeadingSmall>
						{isFetchingWalletBalances ? <Spinner size="sm"></Spinner> : null}
					</HeadingAndSpinner>
				</HeaderBlock>
				<HeaderBlock>
					<HeaderLabel>Total value: ${formatCurrency(totalWalletBalanceUSD)}</HeaderLabel>
				</HeaderBlock>
			</Header>
			<Body>
				<Table cellSpacing="0">
					<Thead>
						<Tr>
							{[
								{ key: 'name', value: 'asset' },
								{ key: 'balance', value: 'quantity' },
								{ key: 'usdBalance', value: 'value' },
							].map(({ key, value }, i) => {
								return (
									<Th key={i}>
										<ButtonSort
											onClick={() => {
												if (!assets) return;
												setSortIsAscending(!sortIsAcending);
												setAssets(sortBy(assets, key, sortIsAcending));
											}}
										>
											<DataSmall color={colors.fontTertiary}>{value}</DataSmall>
										</ButtonSort>
									</Th>
								);
							})}
						</Tr>
					</Thead>
					<Tbody>
						{assets.map((asset, i) => {
							const currentSynth = synths.find(synth => asset.name === synth.name);
							return (
								<Tr key={i}>
									<Td
										style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}
										onClick={() => setSynthSearch(asset.name)}
									>
										<Currency.Icon
											currencyKey={asset.name}
											width="14px"
											height="18px"
											style={{ marginRight: '8px' }}
										/>
										<DataLabelHoverable isHoverable={asset.name !== CRYPTO_CURRENCY_MAP.ETH}>
											{asset.name}
										</DataLabelHoverable>
									</Td>
									<Td>
										<DataLabel>{formatCurrency(asset.balance)}</DataLabel>
									</Td>
									<Td>
										<DataLabel>${formatCurrency(asset.usdBalance)}</DataLabel>
									</Td>
								</Tr>
							);
						})}
						<Tr></Tr>
					</Tbody>
				</Table>
			</Body>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	background: ${props => props.theme.colors.surfaceL2};
	display: flex;
	flex-direction: column;
	height: 100%;
`;

const Header = styled.div`
	background: ${props => props.theme.colors.surfaceL3};
	width: 100%;
	padding: 18px;
	padding-bottom: 0;
	text-transform: uppercase;
`;

const Body = styled.div`
	height: 100%;
	min-height: 0;
`;

const HeaderBlock = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 10px;
`;

const HeaderLabel = styled(DataSmall)`
	text-transform: none;
	color: ${props => props.theme.colors.fontTertiary};
`;

const LinkInner = styled.div`
	display: flex;
	align-items: center;
`;

const LinkLabel = styled(LabelSmall)`
	text-transform: none;
	margin-left: 10px;
	color: ${props => props.theme.colors.hyperlink};
	&:hover {
		text-decoration: underline;
	}
`;

const LinkIcon = styled.img`
	width: 8px;
	height: 8px;
	margin-left: 5px;
`;

const HeadingAndSpinner = styled.div`
	display: flex;
	align-items: center;
	height: 20px;
	& > :first-child {
		margin-right: 8px;
	}
`;

const DataLabelHoverable = styled(DataLabel)`
	cursor: ${props => (props.isHoverable ? 'pointer' : 'not-allowed')};
	pointer-events: ${props => (props.isHoverable ? 'auto' : 'none')};
	&:hover {
		text-decoration: underline;
	}
`;

const mapStateToProps = state => ({
	totalWalletBalanceUSD: getTotalWalletBalanceUSD(state),
	walletInfo: getWalletInfo(state),
	walletBalances: getWalletBalances(state),
	synths: getAvailableSynths(state),
	isFetchingWalletBalances: getIsFetchingWalletBalances(state),
});

const mapDispatchToProps = {
	setSynthSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(WalletBox));
