/*  eslint-disable */
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';
import orderBy from 'lodash/orderBy';

import { HeadingSmall, DataSmall, LabelSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';
import { ButtonSort } from '../Button';
import Spinner from '../Spinner';

import { getWalletBalances, getWalletInfo } from '../../ducks';
import { formatCurrency } from '../../utils/formatters';

const getTotal = balances => {
	if (!balances) return 0;
	const { eth, synths } = balances;
	return formatCurrency(eth.usdBalance + synths.usdBalance);
};

const formatAssets = balances => {
	if (!balances) return [];
	const { eth, snx, synths } = balances;
	let assets = [{ name: 'ETH', ...eth }];
	Object.keys(synths.balances).forEach(key => {
		assets.push({ name: key, ...synths.balances[key] });
	});
	return assets;
};

const sortBy = (assets, column, isAscending) => {
	return orderBy(assets, column, [isAscending ? 'asc' : 'desc']);
};

const WalletBox = ({ theme: { colors }, balances, walletInfo: { currentWallet } }) => {
	const [assets, setAssets] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [sortIsAcending, setSortIsAscending] = useState(true);
	useEffect(() => {
		if (currentWallet) setIsLoading(true);
		if (!balances) return;
		const dataAssets = formatAssets(balances);
		setAssets(sortBy(dataAssets, 'usdBalance', false));
		setIsLoading(false);
	}, [balances, currentWallet]);

	return (
		<Container>
			<Header>
				<HeaderBlock>
					<HeadingAndSpinner>
						<HeadingSmall>Wallet Balance</HeadingSmall>
						{isLoading ? <Spinner size="tiny"></Spinner> : null}
					</HeadingAndSpinner>
					{/* <Link style={{ textDecoration: 'none' }} to={'/'}>
						<LinkInner>
							<LinkLabel>View Stats</LinkLabel>
							<LinkIcon src="/images/link-arrow.svg" />
						</LinkInner>
					</Link> */}
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
							return (
								<Tr key={i}>
									<Td style={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
										<SynthIcon src={`/images/synths/${asset.name}.svg`} />
										<DataLabel>{asset.name}</DataLabel>
									</Td>
									<Td>
										<DataLabel>{formatCurrency(asset.balance)}</DataLabel>
									</Td>
									<Td>
										<DataLabel style={{ color: colors.green }}>
											${formatCurrency(asset.usdBalance)}
										</DataLabel>
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
	color: ${props => props.theme.colors.hyperLink};
	&:hover {
		text-decoration: underline;
	}
`;

const LinkIcon = styled.img`
	width: 8px;
	height: 8px;
	margin-left: 5px;
`;

const SynthIcon = styled.img`
	width: 14px;
	height: 14px;
	margin-right: 8px;
`;

const HeadingAndSpinner = styled.div`
	display: flex;
	align-items: center;
	& > :first-child {
		margin-right: 8px;
	}
`;

const mapStateToProps = state => {
	return {
		balances: getWalletBalances(state),
		walletInfo: getWalletInfo(state),
	};
};

export default connect(mapStateToProps, null)(withTheme(WalletBox));
