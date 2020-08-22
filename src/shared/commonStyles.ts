import styled, { keyframes, css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import { DataLarge, DataSmall, DataMedium } from '../components/Typography';
import { tableDataSmallCSS } from 'components/Typography/Table';
import { chartDataCSS } from 'components/Typography/General';

import { Z_INDEX } from '../constants/ui';
import { media, breakpoint } from './media';

import SearchInput from 'components/Input/SearchInput';
import Modal from '@material-ui/core/Modal';

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

export const FlexDivRowCentered = styled(FlexDivRow)`
	align-items: center;
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

export const VerticalCardSeparator = styled.div`
	height: 12px;
	background-color: ${(props) => props.theme.colors.accentL2};
	width: 1px;
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
	background-color: ${(props) => props.theme.colors.accentL2};
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
	outline: none;
`;

export const LinkTextSmall = styled(DataSmall)`
	color: ${(props) => props.theme.colors.hyperlink};
`;

export type MessageProps = {
	size: 'sm' | 'lg';
	floating?: boolean;
	type: 'error' | 'success' | 'info';
};

export const Message = styled(FlexDivCentered)<MessageProps>`
	color: ${(props) => props.theme.colors.white};
	border-radius: 1px;
	transition: opacity 0.2s ease-out;
	width: 100%;
	
	${(props) =>
		props.size === 'sm'
			? css`
					font-size: 12px;
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
					background-color: ${(props) => props.theme.colors.red};
				`;
			}
			case 'success': {
				return css`
					background-color: ${(props) => props.theme.colors.green};
				`;
			}
			case 'info': {
				return css`
					background-color: ${(props) => props.theme.colors.accentL1};
				`;
			}
			default:
		}
	}}
`;

export const InfoBox = styled.div`
	display: grid;
	grid-row-gap: 10px;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	padding: 13px;
`;

export const InfoBoxLabel = styled(DataSmall)`
	white-space: nowrap;
	color: ${(props) => props.theme.colors.fontTertiary};
	text-transform: uppercase;
`;

export const InfoBoxValue = styled(DataLarge)<{ rateChange?: number }>`
	text-transform: none;
	font-size: 14px;
	transition: all 0.3s ease-in-out;
	${(props) =>
		props.rateChange === 1 &&
		css`
			color: ${props.theme.colors.green};
		`}
	${(props) =>
		props.rateChange === -1 &&
		css`
			color: ${props.theme.colors.red};
		`}
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

	background-color: ${(props) => props.theme.colors.accentL1};
`;

export const TableNoResults = styled.div`
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

export const shiftUpHoverEffectCSS = css`
	transition: all 0.2s ease-in-out;
	&:hover {
		transform: translateY(-4px);
	}
`;

export const TableOverflowContainer = styled.div`
	overflow: auto;
`;

export const resetButtonCSS = css`
	border: none;
	background: none;
	outline: none;
	cursor: pointer;
	padding: 0;
`;

export const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOutAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const GridDiv = styled.div`
	display: grid;
`;

export const GridDivCentered = styled(GridDiv)`
	align-items: center;
`;

export const GridDivRow = styled(GridDiv)`
	grid-auto-flow: row;
`;

export const GridDivCenteredRow = styled(GridDivCentered)`
	grid-auto-flow: row;
`;

export const GridDivCol = styled(GridDiv)`
	grid-auto-flow: column;
`;

export const GridDivCenteredCol = styled(GridDivCentered)`
	grid-auto-flow: column;
`;

export const AssetSearchInput = styled(SearchInput)`
	width: 240px;
	.search-input {
		height: 40px;
	}
	${media.small`
		width: 100%;
	`}
`;

export const NoResultsMessage = styled.div`
	padding: 18px;
`;

export const PageContent = styled.div`
	max-width: ${breakpoint.large}px;
	margin: 0 auto;
`;

export const LoaderContainer = styled.div`
	position: relative;
	height: 400px;
`;

export const Strong = styled.span`
	font-family: ${(props) => props.theme.fonts.medium};
`;

export const FullScreenModal = styled(Modal).attrs({
	disableEscapeKeyDown: true,
	disableAutoFocus: true,
	disableEnforceFocus: true,
	disableRestoreFocus: true,
})`
	background-color: ${(props) => props.theme.colors.surfaceL1};
	display: flex;
	align-items: center;
	justify-content: center;
	opacity: 1;
	overflow: auto;
`;

export const FullScreenModalContainer = styled.div`
	background-color: ${(props) => props.theme.colors.surfaceL1};
	text-align: center;
	outline: none;
`;

export const FullScreenModalCloseButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	right: 5%;
	top: 5%;
	color: ${({ theme }) => theme.colors.fontTertiary};
`;

export const QuestionMarkIcon = styled.div`
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: 12px;
	height: 12px;
	background-color: ${(props) => props.theme.colors.accentL1};
	margin-left: 4px;
	svg {
		height: 8px;
	}
`;
