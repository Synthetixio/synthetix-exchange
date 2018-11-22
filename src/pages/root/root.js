import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Home from '../home';
import Exchange from '../exchange';
import styles from './root.module.scss';

class Root extends Component {
  render() {
    return (
      <Router>
        <div className={styles.root}>
          <Route exact path="/" component={Home} />
          <Route path="/exchange" component={Exchange} />
        </div>
      </Router>
    );
  }
}

export default Root;
