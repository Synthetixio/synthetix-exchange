/*  eslint-disable */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import orderBy from 'lodash/orderBy';

import { getAvailableSynths } from '../../ducks/synths';

import { HeadingSmall, DataSmall, LabelSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';
import { ButtonSort } from '../Button';
import Spinner from '../Spinner';
import Currency from '../Currency';

import { getWalletInfo, getIsFetchingWalletBalances } from '../../ducks';
import { setSynthPair } from '../../ducks/synths';
import { setSynthSearch } from '../../ducks/ui';
import { formatCurrency } from '../../utils/formatters';
import { CRYPTO_CURRENCY_MAP } from '../../constants/currency';

const getTotal = balances => {
	if (!balances) return 0;
	const { eth, synths } = balances;
	return formatCurrency(eth.usdBalance + synths.usdBalance);
};

const formatAssets = balances => {
	if (!balances) return [];
	const { eth, snx, synths } = balances;
	let assets = [{ name: CRYPTO_CURRENCY_MAP.ETH, ...eth }];
	Object.keys(synths.balances).forEach(key => {
		const synth = synths.balances[key];
		if (synth && synth.balance > 0) {
			assets.push({ name: key, ...synth });
		}
	});
	return assets;
};

const sortBy = (assets, column, isAscending) => {
	return orderBy(assets, column, [isAscending ? 'asc' : 'desc']);
};

const WalletBox = ({
	synths,
	setSynthPair,
	theme: { colors },
	walletInfo: { currentWallet, balances },
	setSynthSearch,
	isFetchingWalletBalances,
}) => {
	const [assets, setAssets] = useState([]);
	const [sortIsAcending, setSortIsAscending] = useState(true);
	useEffect(() => {
		if (!balances) return;
		const dataAssets = formatAssets(balances);
		setAssets(sortBy(dataAssets, 'usdBalance', false));
	}, [balances, currentWallet]);

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
					<HeaderLabel>Total value: ${getTotal(balances)}</HeaderLabel>
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
	background-color: ${props => props.theme.colors.surfaceL2};
	display: flex;
	flex-direction: column;
	height: 100%;
`;

const Header = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
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

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
		synths: getAvailableSynths(state),
		isFetchingWalletBalances: getIsFetchingWalletBalances(state),
	};
};

const mapDispatchToProps = {
	setSynthPair,
	setSynthSearch,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(WalletBox));
