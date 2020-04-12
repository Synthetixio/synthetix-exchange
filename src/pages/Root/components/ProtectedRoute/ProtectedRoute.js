import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { ROUTES } from 'constants/routes';

import { getIsLoggedIn } from 'ducks/wallet/walletDetails';

// TODO: redirect to the "login/wallet selection page"
export const ProtectedRoute = ({ isLoggedIn, ...rest }) => {
	if (!isLoggedIn) {
		return <Redirect to={ROUTES.Home} />;
	}

	return <Route {...rest} />;
};

const mapStateToProps = state => ({
	isLoggedIn: getIsLoggedIn(state),
});

export default connect(mapStateToProps, null)(ProtectedRoute);
