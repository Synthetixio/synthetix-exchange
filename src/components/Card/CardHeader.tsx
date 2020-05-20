import React, { FC, memo } from 'react';
import styled from 'styled-components';

import { CARD_HEIGHT } from 'constants/ui';

import { FlexDivCentered } from 'shared/commonStyles';

export type CardHeaderProps = {
	children: React.ReactNode;
};

const CardHeader: FC<CardHeaderProps> = memo(({ children, ...rest }) => (
	<Container {...rest}>{children}</Container>
));

const Container = styled(FlexDivCentered)`
	background-color: ${(props) => props.theme.colors.surfaceL3};
	color: ${(props) => props.theme.colors.fontPrimary};
	height: ${CARD_HEIGHT};
	padding: 0 18px;
	justify-content: flex-start;
	text-transform: uppercase;

	> * + * {
		margin-left: 10px;
	}
`;

export default CardHeader;
