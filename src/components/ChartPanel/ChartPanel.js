import React from 'react';
import { Link } from 'react-router-dom';
import styled, { withTheme } from 'styled-components';

import { HeadingSmall, LabelSmall, DataSmall, DataLarge } from '../Typography';
import { ButtonFilter } from '../Button';

const ChartPanel = ({ theme }) => {
	const colors = theme.colors;
	return (
		<Container>
			<Header>
				<HeaderBlock>
					<HeadingSmall>sBTC/sETH</HeadingSmall>
					<ButtonFilter height={'22px'}>
						<ButtonIcon src={'/images/reverse-arrow.svg'}></ButtonIcon>
					</ButtonFilter>
					<Link style={{ textDecoration: 'none' }} to={'/'}>
						<LinkInner>
							<LinkLabel>Market Info</LinkLabel>
							<LinkIcon src="/images/link-arrow.svg" />
						</LinkInner>
					</Link>
				</HeaderBlock>
				<HeaderBlock>
					{['1W', '1D', '4H', '1H'].map(time => {
						return <ButtonFilter height={'22px'}>{time}</ButtonFilter>;
					})}
				</HeaderBlock>
			</Header>
			<Body>
				<Chart></Chart>
				<DataRow>
					<DataBlock>
						<DataBlockLabel>Price</DataBlockLabel>
						<DataBlockValue>$1,000</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>Price</DataBlockLabel>
						<DataBlockValue color={colors.green}>$1,000</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>Price</DataBlockLabel>
						<DataBlockValue>$1,000</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>Price</DataBlockLabel>
						<DataBlockValue>$1,000</DataBlockValue>
					</DataBlock>
					<DataBlock>
						<DataBlockLabel>Price</DataBlockLabel>
						<DataBlockValue>$1,000</DataBlockValue>
					</DataBlock>
				</DataRow>
			</Body>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	height: 100%;
	background-color: ${props => props.theme.colors.surfaceL2};
`;

const Header = styled.div`
	background-color: ${props => props.theme.colors.surfaceL3};
	width: 100%;
	height: 54px;
	display: flex;
	align-items: center;
	padding: 0 18px;
	justify-content: space-between;
`;

const Body = styled.div`
	padding: 18px;
`;

const Chart = styled.div`
	height: 400px;
`;
const DataRow = styled.div`
	display: flex;
	& > * {
		margin: 0 12px;
		&:first-child {
			margin-left: 0;
		}
		&:last-child {
			margin-right: 0;
		}
	}
`;
const DataBlock = styled.div`
	flex: 1;
	height: 72px;
	background-color: ${props => props.theme.colors.surfaceL3};
	justify-content: center;
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	padding: 0 22px;
`;

const DataBlockLabel = styled(DataSmall)`
	color: ${props => props.theme.colors.fontTertiary};
`;

const DataBlockValue = styled(DataLarge)`
	color: ${props => (props.color ? props.color : props.theme.colors.fontPrimary)};
`;

const HeaderBlock = styled.div`
	display: flex;
	align-items: baseline;
	& > * {
		margin: 0 6px;
		&:first-child {
			margin-left: 0;
		}
		&:last-child {
			margin-right: 0;
		}
	}
`;

const LinkInner = styled.div`
	display: flex;
	align-items: center;
`;
const LinkLabel = styled(LabelSmall)`
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

const ButtonIcon = styled.img`
	width: 16px;
	height: 12px;
`;

export default withTheme(ChartPanel);
