import styled, { css } from 'styled-components';

import { ExternalLink } from 'shared/commonStyles';
import { ReactComponent as ArrowHyperlinkIcon } from 'assets/images/arrow-hyperlink.svg';

const ViewLink = styled(ExternalLink)`
	color: ${(props) => props.theme.colors.hyperlink};
	box-sizing: border-box;
	font-size: 13px;
	text-align: center;
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
