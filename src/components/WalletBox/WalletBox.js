import React from 'react';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';

import { HeadingSmall, DataSmall, LabelSmall } from '../Typography';
import { Table, Tr, Thead, Tbody, Th, Td, DataLabel } from '../Table';

const WalletBox = ({ theme: { colors } }) => {
	return (
		<Container>
			<Header>
				<HeaderBlock>
					<HeadingSmall>Wallet Balance</HeadingSmall>
					<Link style={{ textDecoration: 'none' }} to={'/'}>
						<LinkInner>
							<LinkLabel>View Stats</LinkLabel>
							<LinkIcon src="/images/link-arrow.svg" />
						</LinkInner>
					</Link>
				</HeaderBlock>
				<HeaderBlock>
					<HeaderLabel>Total value: $100,000 USD</HeaderLabel>
				</HeaderBlock>
			</Header>
			<Body>
				<Table cellSpacing="0">
					<Thead>
						<Tr>
							{[1, 2, 3].map(i => {
								return (
									<Th key={i}>
										<ButtonSort>
											<DataSmall color={colors.fontTertiary}>Asset</DataSmall>
											<SortIcon src={'/images/sort-arrows.svg'} />
										</ButtonSort>
									</Th>
								);
							})}
						</Tr>
					</Thead>
					<Tbody>
						{[1, 2, 3, 4, 5, 6, 7].map(i => {
							return (
								<Tr key={i}>
									<Td>
										<DataLabel>blh fsdf fdsd</DataLabel>
									</Td>
									<Td>
										<DataLabel>blh fsdf fdsd</DataLabel>
									</Td>
									<Td>
										<DataLabel>blh fsdf fdsd</DataLabel>
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
`;

const Header = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
	width: 100%;
	padding: 18px;
	padding-bottom: 0;
	text-transform: uppercase;
`;

const Body = styled.div``;

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

const ButtonSort = styled.button`
	border: none;
	outline: none;
	cursor: pointer;
	background-color: transparent;
	padding: 0;
`;

const SortIcon = styled.img`
	width: 6.5px;
	height: 8px;
	margin-left: 5px;
`;

export default withTheme(WalletBox);
