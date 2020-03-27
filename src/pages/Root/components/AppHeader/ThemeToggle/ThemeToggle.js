import React, { memo } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { ReactComponent as Sun } from 'src/assets/images/sun.svg';
import { ReactComponent as Moon } from 'src/assets/images/moon.svg';

import { ELEMENT_BORDER_RADIUS } from 'src/constants/ui';

import { toggleTheme, getCurrentTheme } from 'src/ducks/ui';

import { isLightTheme } from 'src/styles/theme';

import { Dot } from 'src/shared/commonStyles';

export const ThemeToggle = memo(({ currentTheme, toggleTheme }) => (
	<StyledButton onClick={toggleTheme}>
		{isLightTheme(currentTheme) ? (
			<>
				<Dot />
				<Sun width="16px" height="16px" />
			</>
		) : (
			<>
				<Moon width="16px" height="16px" />
				<Dot />
			</>
		)}
	</StyledButton>
));

ThemeToggle.propTypes = {
	currentTheme: PropTypes.string.isRequired,
	toggleTheme: PropTypes.func.isRequired,
};

const StyledButton = styled.button`
	width: 52px;
	height: 32px;
	background-color: ${props => props.theme.colors.accentL1};
	color: ${props => props.theme.colors.fontTertiary};
	display: flex;
	align-items: center;
	padding: 0 8px;
	border-radius: ${ELEMENT_BORDER_RADIUS};
	justify-content: space-between;
	cursor: pointer;
	border: none;
	outline: none;
`;

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps = {
	toggleTheme,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeToggle);
