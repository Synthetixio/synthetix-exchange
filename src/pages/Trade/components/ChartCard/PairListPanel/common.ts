import styled from 'styled-components';

import { Button } from 'components/Button';

export const StyledButton = styled(Button).attrs({
	size: 'sm',
	palette: 'secondary',
})`
	text-transform: none;
	font-size: 12px;
`;

export const IconButton = styled(StyledButton)`
	width: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	> * {
		flex-shrink: 0;
	}
`;
