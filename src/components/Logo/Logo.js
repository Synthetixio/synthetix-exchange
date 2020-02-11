import React from 'react';
import { ReactComponent as LogoLight } from '../../images/synthetix-logo-light.svg';
import { ReactComponent as LogoDark } from '../../images/synthetix-logo-dark.svg';

const Logo = ({ theme }) => (theme === 'light' ? <LogoDark /> : <LogoLight />);

export default Logo;
