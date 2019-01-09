import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './config/store';
import './index.css';
import Root from './pages/root';

const App = () => {
  return (
    <Provider store={store}>
      <Root />
    </Provider>
  );
};
ReactDOM.render(<App />, document.getElementById('root'));
