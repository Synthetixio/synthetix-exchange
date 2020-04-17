import React, { memo } from 'react';
import styled from 'styled-components';

import { RoundedIcon, ExternalLink } from 'src/shared/commonStyles';

import { ReactComponent as QuestionMark } from 'src/assets/images/question-mark.svg';

import { LINKS } from 'src/constants/links';

const SupportLink = memo(() => (
	<ExternalLink href={LINKS.Support}>
		<RoundedIcon>
			<StyledQuestionMark />
		</RoundedIcon>
	</ExternalLink>
));

const StyledQuestionMark = styled(QuestionMark)`
	color: ${(props) => props.theme.colors.fontSecondary};
`;

export default SupportLink;
