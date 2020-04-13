import styled, { css } from 'styled-components';

import { dataMediumCSS } from '../Typography/Data';

export const Container = styled.span`
	${(props) =>
		props.showIcon &&
		css`
			display: inline-grid;
			align-items: center;
			grid-auto-flow: column;
			grid-gap: 8px;
		`}
	${dataMediumCSS};
	text-transform: none;
`;
