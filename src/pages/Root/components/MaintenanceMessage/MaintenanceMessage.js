import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';

import { getCurrentTheme } from 'src/ducks';

import { HeadingMedium } from 'src/components/Typography';
import { isDarkTheme, lightTheme, darkTheme } from 'src/styles/theme';

const MaintenanceMessage = ({ currentTheme }) => {
	const themeStyle = isDarkTheme(currentTheme) ? darkTheme : lightTheme;
	return (
		<ThemeProvider theme={themeStyle}>
			<Container>
				<HeadingMedium style={{ color: 'black' }}>
					Synthetix.Exchange is currently down for maintenance.
				</HeadingMedium>
				<HeadingMedium style={{ color: 'black' }}>It will be back shortly.</HeadingMedium>
			</Container>
		</ThemeProvider>
	);
};

const Container = styled.div`
	position: absolute;
	width: 100%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
`;

MaintenanceMessage.propTypes = {
	currentTheme: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(MaintenanceMessage);
