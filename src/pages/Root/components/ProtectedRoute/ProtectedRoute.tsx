import React, { FC } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Route, Redirect, RouteProps } from 'react-router-dom';

import { ROUTES } from 'constants/routes';

import { RootState } from 'ducks/types';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';

const mapStateToProps = (state: RootState) => ({
	isWalletConnected: getIsWalletConnected(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type ProtectedRouteProps = PropsFromRedux & RouteProps;

export const ProtectedRoute: FC<ProtectedRouteProps & PropsFromRedux> = ({
	isWalletConnected,
	path,
	...rest
}) => {
	if (!isWalletConnected) {
		return <Redirect to={ROUTES.Home} />;
	}

	return <Route path={path} {...rest} />;
};

export default connector(ProtectedRoute);
