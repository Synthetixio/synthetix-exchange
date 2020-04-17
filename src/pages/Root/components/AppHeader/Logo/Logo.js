import React, { memo } from 'react';
import styled from 'styled-components';

import { ReactComponent as SynthetixLogo } from 'src/assets/images/synthetix-logo-l2.svg';

const Logo = memo((props) => <StyledSynthetixLogo {...props} />);

const StyledSynthetixLogo = styled(SynthetixLogo)`
	position: relative;
	top: 13px;
	pointer-events: none;
`;

export default Logo;
