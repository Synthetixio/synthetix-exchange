import React, { FC, memo } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { ReactComponent as Sun } from 'assets/images/sun.svg';
import { ReactComponent as Moon } from 'assets/images/moon.svg';

import { ELEMENT_BORDER_RADIUS } from 'constants/ui';

import { RootState } from 'ducks/types';
import { toggleTheme, getCurrentTheme } from 'ducks/ui';

import { isLightTheme } from 'styles/theme';
import { Theme } from 'styles/theme/types';

import { Dot } from 'shared/commonStyles';

type StateProps = {
	currentTheme: Theme;
};

type DispatchProps = {
	toggleTheme: typeof toggleTheme;
};

type ThemeToggleProps = StateProps & DispatchProps;

export const ThemeToggle: FC<ThemeToggleProps> = memo(({ currentTheme, toggleTheme }) => (
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

const StyledButton = styled.button`
	width: 52px;
	height: 32px;
	background-color: ${({ theme }) => theme.colors.accentL1};
	color: ${({ theme }) => theme.colors.fontTertiary};
	display: flex;
	align-items: center;
	padding: 0 8px;
	border-radius: ${ELEMENT_BORDER_RADIUS};
	justify-content: space-between;
	cursor: pointer;
	border: none;
	outline: none;
`;

const mapStateToProps = (state: RootState): StateProps => ({
	currentTheme: getCurrentTheme(state),
});

const mapDispatchToProps: DispatchProps = {
	toggleTheme,
};

export default connect<StateProps, DispatchProps, {}, RootState>(
	mapStateToProps,
	mapDispatchToProps
)(ThemeToggle);
