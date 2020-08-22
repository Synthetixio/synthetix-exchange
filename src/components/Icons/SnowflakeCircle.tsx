import React, { FC } from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import { withStyles, Tooltip } from '@material-ui/core';

import { CurrencyKey } from 'constants/currency';
import { ReactComponent as SnowflakeIcon } from 'assets/images/snowflake.svg';
import { darkTheme } from 'styles/theme';

type SnowflakeCircleProps = {
	radius?: number;
	innerRadius?: number;
	showTooltip?: boolean;
	currencyKey?: CurrencyKey;
};

const SnowflakeCircle: FC<SnowflakeCircleProps> = ({
	radius = 20,
	innerRadius = 16,
	showTooltip = true,
	currencyKey,
}) => (
	<StyledTooltip
		title={
			showTooltip ? (
				<>
					<Trans
						i18nKey="common.frozen.message"
						values={{ currencyKey }}
						components={[<div />, <div />]}
					/>
				</>
			) : (
				''
			)
		}
		placement="top"
		arrow={true}
	>
		<SnowflakeCircleWrapper radius={radius}>
			<StyledSnowflakeCircle height={innerRadius} />
		</SnowflakeCircleWrapper>
	</StyledTooltip>
);

const SnowflakeCircleWrapper = styled.div<{ radius: number }>`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: ${(props) => props.radius}px;
	height: ${(props) => props.radius}px;
	background-color: ${(props) =>
		props.theme.isLightTheme ? props.theme.colors.brand : props.theme.colors.accentL2};
`;

const StyledSnowflakeCircle = styled(SnowflakeIcon)`
	color: ${darkTheme.colors.fontSecondary};
`;

const StyledTooltip = withStyles({
	tooltip: {
		width: '180px',
		textAlign: 'center',
	},
})(Tooltip);

export default SnowflakeCircle;
