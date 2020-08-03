import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { withStyles, Tooltip } from '@material-ui/core';

import { ReactComponent as SnowflakeIcon } from 'assets/images/snowflake.svg';

type SnowflakeCircleProps = {
	radius: number;
	innerRadius: number;
	showTooltip: boolean;
	name?: string;
};

const SnowflakeCircle: FC<SnowflakeCircleProps> = ({ radius, innerRadius, showTooltip, name }) => {
	const { t } = useTranslation();
	const FrozenIcon = (
		<SnowflakeCircleWrapper radius={radius}>
			<StyledSnowflakeCircle innerRadius={innerRadius} />
		</SnowflakeCircleWrapper>
	);
	return showTooltip ? (
		<StyledTooltip title={<>{t('common.frozen.message', { name })}</>} placement="top" arrow={true}>
			{FrozenIcon}
		</StyledTooltip>
	) : (
		<>{FrozenIcon}</>
	);
};

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

const StyledTooltip = withStyles({
	tooltip: {
		width: '180px',
		textAlign: 'center',
	},
})(Tooltip);

export default SnowflakeCircle;
