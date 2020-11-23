import Card from 'components/Card';
import styled from 'styled-components';

export const StyledCardHeader = styled(Card.Header)`
	font-size: 14px;
	color: ${(props) => props.theme.colors.fontSecondary};
	font-family: ${(props) => props.theme.fonts.medium};
`;

export const StyledCardBody = styled(Card.Body)`
	padding: 22px 14px;
`;
