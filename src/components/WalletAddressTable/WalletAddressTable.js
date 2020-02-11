import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { DataLarge } from '../Typography';
import Spinner from '../Spinner';

import { formatCurrency } from '../../utils/formatters';
import { getEtherscanAddressLink } from '../../utils/explorers';
import { getWalletInfo } from '../../ducks';

const HEADER_LABELS = ['Wallet Address', 'SNX', 'sUSD', 'ETH', ''];

const Balance = ({ value }) => {
	if (value === undefined) return <Spinner size="tiny" />;
	return <DataLabel>{formatCurrency(value)}</DataLabel>;
};

const WalletAddressTable = ({ data, walletInfo, onWalletSelection }) => {
	const { networkId } = walletInfo;
	return (
		<Table cellSpacing="0">
			<Thead>
				<Tr>
					{HEADER_LABELS.map(header => {
						return (
							<Th key={header}>
								<HeaderLabel>{header}</HeaderLabel>
							</Th>
						);
					})}
				</Tr>
			</Thead>
			<Tbody>
				{data.map((wallet, i) => {
					return (
						<Tr key={i} onClick={() => onWalletSelection(wallet, i)}>
							<Td>
								<DataLabel>{wallet.address}</DataLabel>
							</Td>
							<Td>
								<Balance value={wallet.balances.snxBalance} />
							</Td>
							<Td>
								<Balance value={wallet.balances.sUSDBalance} />
							</Td>
							<Td>
								<Balance value={wallet.balances.ethBalance} />
							</Td>
							<Td
								onClick={e => {
									e.stopPropagation();
								}}
							>
								<Link href={getEtherscanAddressLink(networkId, wallet.address)} target="_blank">
									<LinkImg width="20" src="/images/etherscan-logo.png" />
								</Link>
							</Td>
						</Tr>
					);
				})}
			</Tbody>
		</Table>
	);
};

const HeaderLabel = styled(DataLarge)`
	font-size: 16px;
	color: ${props => props.theme.colors.fontSecondary};
`;

const DataLabel = styled(DataLarge)`
	font-size: 16px;
	text-transform: none;
`;

const Table = styled.table`
	width: 100%;
	border-spacing: 0 10px;
`;

const Thead = styled.thead``;

const Tbody = styled.tbody`
	& > tr {
		transition: transform 0.2s ease-in-out;
		cursor: pointer;
		&:hover {
			transform: scale(1.02);
		}
	}
`;

const Tr = styled.tr`
	& th:first-child,
	td:first-child {
		text-align: left;
	}
`;

const Th = styled.th`
	padding: 0 20px 20px 20px;
	text-align: right;
`;

const Td = styled.td`
	padding: 0 20px;
	text-align: right;
	height: 48px;
	border-top: 1px solid ${props => props.theme.colors.accentDark};
	border-bottom: 1px solid ${props => props.theme.colors.accentDark};
	&:first-child {
		border-left: 1px solid ${props => props.theme.colors.accentDark};
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
	}
	&:last-child {
		border-right: 1px solid ${props => props.theme.colors.accentDark};
		border-top-right-radius: 2px;
		border-bottom-right-radius: 2px;
	}
	background-color: ${props => props.theme.colors.surfaceL3};
`;

const Link = styled.a`
	display: flex;
	align-items: center;
	justify-content: flex-end;
`;

const LinkImg = styled.img`
	width: 20px;
	height: 20px;
`;

const mapStateToProps = state => {
	return {
		walletInfo: getWalletInfo(state),
	};
};

export default connect(mapStateToProps, null)(WalletAddressTable);
