import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { getCurrentTheme } from '../../ducks';
import { toggleTheme } from '../../ducks/ui';

const ThemeSwitcher = ({ currentTheme, toggleTheme }) => {
	return (
		<ThemeSwitcherButton onClick={toggleTheme}>
			{currentTheme === 'light' ? (
				<Fragment>
					<Dot></Dot>
					<Icon src={'/images/sun.svg'}></Icon>
				</Fragment>
			) : (
				<Fragment>
					<Icon src={'/images/moon.svg'}></Icon>
					<Dot></Dot>
				</Fragment>
			)}
		</ThemeSwitcherButton>
	);
};

const ThemeSwitcherButton = styled.button`
	width: 62px;
	height: 32px;
	background-color: ${props => props.theme.colors.accentDark};
	display: flex;
	align-items: center;
	padding: 0 8px;
	borde-radius: 1px;
	justify-content: space-between;
	border-radius: 1px;
	cursor: pointer;
	border: none;
`;

const Dot = styled.div`
	width: 14px;
	height: 14px;
	border-radius: 50%;
	background-color: ${props => props.theme.colors.accentLight};
`;

const Icon = styled.img`
	width: 16px;
	height: 16px;
`;

const mapStateToProps = state => {
	return {
		currentTheme: getCurrentTheme(state),
	};
};

const mapDispatchToProps = {
	toggleTheme,
};

ThemeSwitcher.propTypes = {
	currentTheme: PropTypes.string.isRequired,
	toggleTheme: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ThemeSwitcher);
