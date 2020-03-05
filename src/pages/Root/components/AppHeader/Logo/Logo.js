import React, { memo } from 'react';
import styled from 'styled-components';

import { ReactComponent as SynthetixLogo } from 'src/assets/images/synthetix-logo.svg';

const Logo = memo(() => <StyledSynthetixLogo />);

const StyledSynthetixLogo = styled(SynthetixLogo)`
	color: ${props => props.theme.colors.brand};
`;

export default Logo;
