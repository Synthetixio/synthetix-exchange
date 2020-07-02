import React, { FC } from 'react';
import styled from 'styled-components';

import { Side } from 'pages/Options/types';

import { ReactComponent as TrendUpIcon } from 'assets/images/trend-up.svg';
import { ReactComponent as TrendDownIcon } from 'assets/images/trend-down.svg';

type SideIconProps = {
	side: Side;
};

const SideIcon: FC<SideIconProps> = ({ side, ...rest }) => (
	<Container side={side} {...rest}>
		{side === 'long' ? <TrendUpIcon /> : <TrendDownIcon />}
	</Container>
);

const Container = styled.span<{ side: Side }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 2px;
	width: 20px;
	height: 20px;
	background-color: ${(props) =>
		props.side === 'long' ? props.theme.colors.green : props.theme.colors.red};
	color: ${(props) =>
		props.theme.isDarkTheme ? props.theme.colors.surfaceL1 : props.theme.colors.white};
`;

export default SideIcon;
