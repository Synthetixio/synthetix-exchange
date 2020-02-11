import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import store from './config/store';
import './index.css';
import Root from './pages/Root';
import './i18n';

import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

bugsnag.releaseStage = process.env.NODE_ENV;
const bugsnagClient = bugsnag('5eab4fa004f3869741bb65684d7fb5e3', {
	notifyReleaseStages: ['production', 'staging'],
});

window.var = process.env;
console.log('NODE_ENV', process.env.NODE_ENV);
console.log(bugsnag.releaseStage);

bugsnagClient.use(bugsnagReact, React);
const ErrorBoundary = bugsnagClient.getPlugin('react');
const App = () => {
	return (
		<Suspense fallback={<div />}>
			<Provider store={store}>
				<Root />
			</Provider>
		</Suspense>
	);
};
ReactDOM.render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>,
	document.getElementById('root')
);
