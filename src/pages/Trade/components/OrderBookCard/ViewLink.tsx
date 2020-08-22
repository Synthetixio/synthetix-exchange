import styled, { css } from 'styled-components';

import { ExternalLink } from 'shared/commonStyles';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';

const ViewLink = styled(ExternalLink)<{ isDisabled?: boolean }>`
	color: ${(props) => props.theme.colors.hyperlink};
	box-sizing: border-box;
	flex: 150 0 auto;
	min-width: 0px;
	width: 150px;
	font-size: 13px;
	${(props) =>
		props.isDisabled &&
		css`
			opacity: 0.3;
			pointer-events: none;
		`}
`;

export const ArrowIcon = styled(ArrowHyperlinkIcon)`
	margin-left: 5px;
`;

export default ViewLink;
