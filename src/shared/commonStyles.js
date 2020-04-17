import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { DataLarge, DataSmall, DataMedium } from '../components/Typography';
import { tableDataSmallCSS, chartDataCSS } from 'src/components/Typography/Data';

import { Z_INDEX, APP_HEADER_HEIGHT } from '../constants/ui';

import { media } from 'src/shared/media';

export const FlexDiv = styled.div`
	display: flex;
`;

export const FlexDivCentered = styled(FlexDiv)`
	align-items: center;
`;

export const FlexDivCol = styled(FlexDiv)`
	flex-direction: column;
`;

export const FlexDivRow = styled(FlexDiv)`
	justify-content: space-between;
`;

export const FlexDivCenteredCol = styled(FlexDivCentered)`
	flex-flow: column;
	position: relative;
`;

export const PageLayout = styled(FlexDiv)`
	width: 100%;
	height: 100%;
	flex: 1;
	min-height: 0;
`;

export const CenteredPageLayout = styled(PageLayout)`
	margin: 0 auto;
	padding: 8px;

	> * + * {
		margin-left: 8px;
	}
`;

export const SectionVerticalSpacer = styled.div`
	margin-bottom: 8px;
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
	background: ${(props) => props.theme.colors.accentL2};
`;

export const FormInputRow = styled.div`
	margin-bottom: 16px;
`;

export const FormInputLabel = styled(DataMedium)`
	color: ${(props) => props.theme.colors.fontTertiary};
	font-family: ${(props) => props.theme.fonts.medium};
	text-transform: uppercase;
`;

export const FormInputLabelSmall = styled(DataSmall)`
	text-transform: none;
	color: ${(props) => props.theme.colors.fontTertiary};
	font-family: ${(props) => props.theme.fonts.light};
`;

export const TextButton = styled.button`
	border: none;
	background: transparent;
	padding: 0;
	cursor: pointer;
`;

export const LinkTextSmall = styled(DataSmall)`
	color: ${(props) => props.theme.colors.hyperlink};
`;

export const Message = styled(FlexDivCentered)`
	border-radius: 1px;
	transition: opacity 0.2s ease-out;
	width: 100%;
	
	${(props) =>
		props.size === 'sm'
			? css`
					font-size: 11px;
					padding: 5px 10px;
			  `
			: css`
					font-size: 13px;
					padding: 11px 10px;
			  `}		

	${(props) =>
		props.floating &&
		css`
			z-index: ${Z_INDEX.TOOLTIP};
			position: absolute;
		`}

	${(props) => {
		switch (props.type) {
			case 'error': {
				return css`
					background: ${(props) => props.theme.colors.red};
				`;
			}
			case 'success': {
				return css`
					background: ${(props) => props.theme.colors.green};
				`;
			}
			default:
		}
	}}
`;

export const InfoBox = styled.div`
	display: grid;
	grid-row-gap: 10px;
	background: ${(props) => props.theme.colors.surfaceL3};
	padding: 13px;
`;

export const InfoBoxLabel = styled(DataSmall)`
	white-space: nowrap;
	color: ${(props) => props.theme.colors.fontTertiary};
	text-transform: uppercase;
`;

export const InfoBoxValue = styled(DataLarge)`
	text-transform: none;
	font-size: 14px;
`;

export const CurrencyKey = styled.span`
	text-transform: none;
`;

export const absoluteCenteredCSS = css`
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
`;

export const RoundedIcon = styled(FlexDivCentered)`
	width: 32px;
	height: 32px;
	border-radius: 100%;
	justify-content: center;

	background: ${(props) => props.theme.colors.accentL1};
`;

export const TableNoResults = styled.div`
	padding-top: 20px;
	color: ${(props) => props.theme.colors.fontPrimary};
	${tableDataSmallCSS};
	padding: 18px;
`;

export const CardHeadingDescription = styled.span`
	${chartDataCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	&&& {
		margin-left: auto;
	}
`;

export const resetButtonCSS = css`
	border: none;
	background: none;
	outline: none;
	cursor: pointer;
`;

export const CenteredContent = styled(FlexDivCentered)`
	margin-top: -${APP_HEADER_HEIGHT};
	width: 100%;
	max-width: 624px;
	margin: 0 auto;
	flex-grow: 1;
	flex-direction: column;
	justify-content: center;
	position: relative;
	${media.small`
			margin-top: 40px;
			justify-content: initial;
	`}
`;

export const Popup = styled.div`
	z-index: ${Z_INDEX.MODAL};
	background: ${(props) => props.theme.colors.surfaceL1};
	position: absolute;
	width: 100%;
	height: 100vh;
	top: 0;
	left: 0;
	display: flex;
	flex-flow: column;
`;

export const textShadowCSS = css`
	text-shadow: 0px 0px 10px #b47598;
`;

export const gradientTextCSS = css`
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
`;
