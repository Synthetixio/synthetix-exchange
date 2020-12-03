import React, { FC, useContext, useState } from 'react';
import styled, { ThemeContext } from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import snxData from 'synthetix-data';

import { getCurrentWalletAddress, getNetworkId } from 'ducks/wallet/walletDetails';

import { ReactComponent as CloseCrossIcon } from 'assets/images/close-cross.svg';
import EtherScanImage from 'assets/images/etherscan-logo.png';
import { ReactComponent as StarIcon } from 'assets/images/star.svg';

import { RootState } from 'ducks/types';

import {
	FullScreenModal,
	FullScreenModalContainer,
	FullScreenModalCloseButton,
	NoResultsMessage,
	Strong,
	TableOverflowContainer,
} from 'shared/commonStyles';

import SearchInput from 'components/Input/SearchInput';
import Table from 'components/Table';
import { CellProps } from 'react-table';
import { formatCurrencyWithKey, formatShortDate } from 'utils/formatters';
import { SYNTHS_MAP } from 'constants/currency';
import { getEtherscanTxLink } from 'utils/explorers';
import Link from 'components/Link';
import useDebouncedMemo from 'shared/hooks/useDebouncedMemo';
import { SEARCH_DEBOUNCE_MS } from 'constants/ui';
import { useQuery } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';

const mapStateToProps = (state: RootState) => ({
	currentWalletAddress: getCurrentWalletAddress(state),
	networkId: getNetworkId(state),
});

const mapDispatchToProps = {};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type LiquidationsModalProps = PropsFromRedux & {
	onClose: () => void;
};

type Liquidation = {
	currency: string;
	liquidator: string;
	timestamp: number;
	price: number;
	size: number;
	transactionHash: string;
};

/**
 * 
 * account: "0x133675afe710dd0da4a61e99e039c225671cc9a3"
	currency: "sETH"
	liquidator: "0xb64ff7a4a33acdf48d97dab0d764afd0f6176882"
	market: "0x5f8cf32356f4b13a45326be52fa7589da2480dd5"
	price: 1188.5806451612902
	size: -3.3333333333333335
	timestamp: 1606785232000
	transactionHash: "0x5973761e546aef58d305016011a1a4952dd6ef98460dc1ac3fd00e70375b7b04
 */

const LiquidationsModal: FC<LiquidationsModalProps> = ({
	currentWalletAddress,
	onClose,
	networkId,
}) => {
	const { colors } = useContext(ThemeContext);
	const [addressSearch, setAddressSearch] = useState<string>('');

	const liquidationsQuery = useQuery<Liquidation[], any>(
		QUERY_KEYS.Futures.Liquidations,
		async () => {
			const liquidations: Liquidation[] = await snxData.futures.liquidations();

			return liquidations;
		}
	);

	const liquidations = liquidationsQuery.isSuccess ? liquidationsQuery.data : [];

	const isLoading = liquidationsQuery.isLoading;
	const isLoaded = liquidationsQuery.isSuccess;

	const addressFilteredLiquidations = useDebouncedMemo(
		() =>
			addressSearch
				? liquidations.filter(({ liquidator }) =>
						liquidator.toLowerCase().includes(addressSearch.toLowerCase())
				  )
				: liquidations,
		[liquidations, addressSearch],
		SEARCH_DEBOUNCE_MS
	);

	return (
		<FullScreenModal open={true} BackdropProps={{ style: { backgroundColor: colors.surfaceL1 } }}>
			<FullScreenModalContainer>
				<FullScreenModalCloseButton onClick={onClose}>
					<CloseCrossIcon />
				</FullScreenModalCloseButton>
				<Title>Liquidated Accounts</Title>
				<SearchInputContainer>
					<StyledSearchInput
						onChange={(e) => setAddressSearch(e.target.value)}
						value={addressSearch}
						placeholder="e.g. 0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7..."
					/>
				</SearchInputContainer>
				<TableOverflowContainer>
					<StyledTable
						palette="striped"
						columns={[
							{
								Header: <>WALLET ADDRESS</>,
								accessor: 'liquidator',
								Cell: (cellProps: CellProps<Liquidation, Liquidation['liquidator']>) => (
									<span>
										{cellProps.value} {currentWalletAddress === cellProps.value && <StarIcon />}
									</span>
								),
								width: 400,
								sortable: true,
							},
							{
								Header: <>LIQUIDATED AT</>,
								accessor: 'timestamp',
								Cell: (cellProps: CellProps<Liquidation, Liquidation['timestamp']>) => (
									<span>{formatShortDate(cellProps.value)}</span>
								),
								width: 200,
								sortable: true,
							},
							{
								Header: <>LIQUIDATION PRICE</>,
								accessor: 'price',
								Cell: (cellProps: CellProps<Liquidation, Liquidation['price']>) => (
									<span>{formatCurrencyWithKey(SYNTHS_MAP.sUSD, cellProps.value)}</span>
								),
								width: 200,
								sortable: true,
							},
							{
								Header: <>POSITION SIZE</>,
								accessor: 'size',
								Cell: (cellProps: CellProps<Liquidation, Liquidation['size']>) => (
									<span>
										{formatCurrencyWithKey(cellProps.row.original.currency, cellProps.value)}
									</span>
								),
								sortable: true,
							},
							{
								Header: <>VIEW</>,
								id: 'txHash',
								Cell: (cellProps: CellProps<Liquidation>) => (
									<Link
										to={getEtherscanTxLink(networkId, cellProps.row.original.transactionHash)}
										isExternal={true}
									>
										<LinkImg width="20px" src={EtherScanImage} />
									</Link>
								),
								width: 50,
								sortable: true,
							},
						]}
						data={addressSearch ? addressFilteredLiquidations : liquidations}
						columnsDeps={[currentWalletAddress]}
						isLoading={isLoading}
						noResultsMessage={
							addressSearch && addressFilteredLiquidations.length === 0 ? (
								<NoResultsMessage>
									no results for <Strong>{addressSearch}</Strong>
								</NoResultsMessage>
							) : isLoaded && liquidations.length === 0 ? (
								<NoResultsMessage>No liquidations found.</NoResultsMessage>
							) : undefined
						}
					/>
				</TableOverflowContainer>
			</FullScreenModalContainer>
		</FullScreenModal>
	);
};

const Title = styled.div`
	color: ${(props) => props.theme.colors.brand};
	font-size: 32px;
	font-family: ${(props) => props.theme.fonts.medium};
	padding-bottom: 24px;
`;

const SearchInputContainer = styled.div`
	width: 500px;
	margin: 0 auto;
`;

export const StyledSearchInput = styled(SearchInput)`
	.search-input {
		height: 40px;
		font-size: 14px;
		&::placeholder {
			text-transform: none;
		}
	}
	margin-bottom: 46px;
`;

const StyledTable = styled(Table)`
	min-height: 350px;
	.table-row,
	.table-body-row {
		& > :last-child {
			justify-content: flex-end;
		}
	}
	.table-body {
		max-height: 50vh;
	}
`;

const LinkImg = styled.img`
	width: 20px;
	height: 20px;
`;

export default connector(LiquidationsModal);
