import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';

export const FlexDiv = styled.div`
	display: flex;
`;

export const FlexDivCentered = styled(FlexDiv)`
	align-items: center;
`;

export const FlexDivCol = styled(FlexDiv)`
	flex-direction: column;
`;

export const MainLayout = styled(FlexDiv)`
	flex-flow: column;
	width: 100%;
	height: 100vh;
	/* TODO: get color from theme */
	color: white;
	position: relative;
`;

export const PageLayout = styled(FlexDiv)`
	width: 100%;
	height: 100%;
	flex: 1;
	min-height: 0;
`;

export const linkCSS = css`
	text-decoration: none;
	&:hover {
		text-decoration: none;
	}
`;

export const ExternalLink = styled.a.attrs({
	target: '_blank',
	rel: 'noopener',
})`
	${linkCSS};
`;

export const Link = styled(NavLink).attrs({
	activeClassName: 'active',
})`
	${linkCSS};
`;

export const Dot = styled.div`
	width: 14px;
	height: 14px;
	border-radius: 50%;
	background-color: ${props => props.theme.colors.accentLight};
`;
