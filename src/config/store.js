import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';

import reducers from '../ducks';
import rootSaga from '../ducks/sagas';

export function persistState(reducerModule, update) {
	try {
		let state = {};
		const serializedState = localStorage.getItem('persistedState');
		if (serializedState !== null) {
			state = JSON.parse(serializedState);
		}
		state[reducerModule] = state[reducerModule] || {};
		Object.assign(state[reducerModule], update);
		localStorage.setItem('persistedState', JSON.stringify(state));
	} catch (err) {
		// empty
	}
}

export function getPersistedState(reducerModule) {
	let persistedState = {};
	try {
		const serializedState = localStorage.getItem('persistedState');
		if (serializedState !== null) {
			persistedState = JSON.parse(serializedState);
			return persistedState[reducerModule];
		}
	} catch (err) {
		// empty
	}

	return {};
}

const sagaMiddleware = createSagaMiddleware();

const middleware = [thunk, sagaMiddleware];

const finalCreateStore = compose(
	applyMiddleware(...middleware),
	window.devToolsExtension ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
)(createStore);

const store = finalCreateStore(reducers);

sagaMiddleware.run(rootSaga);

export default store;
