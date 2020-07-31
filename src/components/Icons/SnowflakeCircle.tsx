import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as SnowflakeIcon } from 'assets/images/snowflake.svg';

type SnowflakeCircleProps = {
	radius: number;
	innerRadius: number;
};

const SnowflakeCircle: FC<SnowflakeCircleProps> = ({ radius, innerRadius }) => (
	<SnowflakeCircleWrapper radius={radius}>
		<StyledSnowflakeCircle innerRadius={innerRadius} />
	</SnowflakeCircleWrapper>
);

const SnowflakeCircleWrapper = styled.div<{ radius: number }>`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: ${(props) => props.radius}px;
	height: ${(props) => props.radius}px;
	background-color: ${(props) => props.theme.colors.brand};
`;

const StyledSnowflakeCircle = styled(SnowflakeIcon)<{ innerRadius: number }>`
	height: ${(props) => props.innerRadius}px;
	color: ${(props) => props.theme.colors.fontTertiary};
`;

export default SnowflakeCircle;
