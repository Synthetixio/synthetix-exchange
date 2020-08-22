import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import store from '../../src/config/store';

const withReactRouterProvider = story => <Router store={store}>{story()}</Router>;

export default withReactRouterProvider;
