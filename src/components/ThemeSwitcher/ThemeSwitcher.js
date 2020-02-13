import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ReactComponent as Sun } from '../../assets/images/sun.svg';
import { ReactComponent as Moon } from '../../assets/images/moon.svg';

import { getCurrentTheme } from '../../ducks';
import { toggleTheme } from '../../ducks/ui';
import { isLightTheme } from '../../styles/theme';
import { Dot } from '../../shared/commonStyles';

export const ThemeSwitcher = ({ currentTheme, toggleTheme }) => (
	<ThemeSwitcherButton onClick={toggleTheme}>
		<Dot />
		{isLightTheme(currentTheme) ? (
			<Sun width="16px" height="16px" />
		) : (
			<Moon width="16px" height="16px" />
		)}
	</ThemeSwitcherButton>
);

ThemeSwitcher.propTypes = {
	currentTheme: PropTypes.string.isRequired,
	toggleTheme: PropTypes.func.isRequired,
};

const ThemeSwitcherButton = styled.button`
	width: 62px;
	height: 32px;
	background-color: ${props => props.theme.colors.accentDark};
	display: flex;
	align-items: center;
	padding: 0 8px;
	border-radius: 1px;
	justify-content: space-between;
	cursor: pointer;
	border: none;
`;

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	toggleTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher);
