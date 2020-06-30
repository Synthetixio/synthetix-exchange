import styled from 'styled-components';
import { GridDivCenteredCol } from 'shared/commonStyles';
import Card from 'components/Card';
import { formLabelSmallCSS } from 'components/Typography/Form';
import { Button } from 'components/Button';
import { sectionTitleCSS } from 'components/Typography/General';

import TimeRemaining from 'pages/Options/Home/components/TimeRemaining';

export const StyledCardHeader = styled(Card.Header)`
	padding: 0 16px;
	${sectionTitleCSS};
`;

export const CardContent = styled.div`
	padding: 12px;
	border-bottom: 1px solid ${(props) => props.theme.colors.accentL1};
	&:last-child {
		border-bottom: 0;
	}
`;

export const StyledCardBody = styled(Card.Body)`
	padding: 0;
`;

export const WalletBalance = styled(GridDivCenteredCol)`
	font-family: ${(props) => props.theme.fonts.medium};
	font-size: 12px;
	grid-gap: 8px;
	color: ${(props) => props.theme.colors.fontSecondary};
`;

export const Title = styled.div`
	${formLabelSmallCSS};
`;

export const ActionButton = styled(Button)`
	width: 100%;
`;

export const PhaseEnd = styled.div`
	font-size: 12px;
	text-transform: uppercase;
	text-align: center;
	padding-top: 12px;
`;

export const StyledTimeRemaining = styled(TimeRemaining)`
	background: none;
	font-size: 12px;
	padding: 0;
	display: inline;
`;
