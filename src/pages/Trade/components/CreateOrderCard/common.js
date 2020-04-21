import styled from 'styled-components';
import { DataSmall } from 'src/components/Typography';

export const TooltipContent = styled.div`
	width: 200px;
	& > * + * {
		margin-top: 8px;
	}
`;

export const TooltipLabel = styled(DataSmall)`
	text-transform: none;
`;

export const TooltipContentRow = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;
