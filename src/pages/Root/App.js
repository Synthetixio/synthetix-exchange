import React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import { Router, Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import history from '../../utils/history';

import { ROUTES } from '../../constants/routes';

import { getCurrentTheme } from '../../ducks';

import { darkTheme } from '../../styles/theme';

import Delegate from '../Delegate';

import WalletPopup from '../../components/WalletPopup';

const App = ({ isAppReady }) => (
	<ThemeProvider theme={darkTheme}>
		<Router history={history}>
			<WalletPopup />
			<Switch>
				<Route path={ROUTES.Home} render={() => <Delegate isAppReady={isAppReady} />} />
			</Switch>
		</Router>
	</ThemeProvider>
);

App.propTypes = {
	isAppReady: PropTypes.bool.isRequired,
	currentTheme: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(App);
