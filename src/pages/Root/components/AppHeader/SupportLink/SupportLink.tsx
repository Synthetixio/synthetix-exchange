import React, { FC } from 'react';
import styled, { css } from 'styled-components';

import { RoundedIcon, ExternalLink } from 'shared/commonStyles';

import { ReactComponent as QuestionMark } from 'assets/images/question-mark.svg';

import { LINKS } from 'constants/links';

type SupportLinkProps = {
	isOnSplashPage?: boolean;
};

const SupportLink: FC<SupportLinkProps> = ({ isOnSplashPage }) => (
	<ExternalLink href={LINKS.Support}>
		<StyledRoundedIcon isOnSplashPage={isOnSplashPage}>
			<StyledQuestionMark />
		</StyledRoundedIcon>
	</ExternalLink>
);

const StyledQuestionMark = styled(QuestionMark)`
	color: ${({ theme }) => theme.colors.fontSecondary};
`;

const StyledRoundedIcon = styled(RoundedIcon)<{ isOnSplashPage?: boolean }>`
	border-radius: 1px;
	${(props) =>
		props.isOnSplashPage &&
		css`
			background-color: ${props.theme.colors.surfaceL3};
		`}
`;

export default SupportLink;
