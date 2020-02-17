import React from 'react';
import { ReactComponent as LogoLight } from '../../assets/images/synthetix-logo-light.svg';
import { ReactComponent as LogoDark } from '../../assets/images/synthetix-logo-dark.svg';
import { isLightTheme } from '../../styles/theme';

const Logo = ({ theme }) => (isLightTheme(theme) ? <LogoDark /> : <LogoLight />);

export default Logo;
