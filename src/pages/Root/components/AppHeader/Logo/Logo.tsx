import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as SynthetixLogo } from 'assets/images/synthetix-logo.svg';
import { media } from 'shared/media';

const Logo: FC = (props) => <StyledSynthetixLogo {...props} />;

const StyledSynthetixLogo = styled(SynthetixLogo)`
	color: ${(props) => props.theme.colors.brand};
	${media.small`
		width: 75px;
		height: 24px;
	`}
`;

export default Logo;
