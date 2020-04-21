import React, { FC, memo } from 'react';
import styled, { css } from 'styled-components';

import { formatPercentage } from 'utils/formatters';

type LabelSize = 'sm' | 'md' | 'lg';

type ChangePercentProps = {
	value: number;
	isLabel?: boolean;
	labelSize?: LabelSize;
	className?: string;
};

export const ChangePercent: FC<ChangePercentProps> = memo(
	({ value, isLabel = false, labelSize = 'md', ...rest }) => (
		<Container
			isPositive={value >= 0}
			isLabel={isLabel}
			labelSize={labelSize as LabelSize}
			{...rest}
		>
			{formatPercentage(value)}
		</Container>
	)
);

const Container = styled.span<{ isLabel: boolean; isPositive: boolean; labelSize: LabelSize }>`
	background-color: ${(props) =>
		props.isPositive ? props.theme.colors.green : props.theme.colors.red};

	${(props) =>
		props.isLabel &&
		css`
			border-radius: 1px;
			color: ${(props) => props.theme.colors.white};
			padding: 4px 8px;
			${(props) =>
				// @ts-ignore
				props.labelSize === 'sm' &&
				css`
					font-size: 12px;
					padding: 4px;
				`}
		`}
`;

export default ChangePercent;
