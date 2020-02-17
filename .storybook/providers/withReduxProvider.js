import React from 'react';
import { Provider } from 'react-redux';

import store from '../../src/config/store';

const withReduxProvider = story => <Provider store={store}>{story()}</Provider>;

export default withReduxProvider;
