import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Home from '../home';
import About from '../about';
import HowItWorks from '../how-it-works';
import Markets from '../markets';
import Nav from '../../components/nav';
import ExchangeRoot from '../exchange-root';
import styles from './root.module.scss';

class Root extends Component {
  render() {
    return (
      <Router>
        <div className={styles.root}>
          <Nav />
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/how-it-works" component={HowItWorks} />
          <Route exact path="/markets" component={Markets} />
          <Route path="/exchange" component={ExchangeRoot} />
        </div>
      </Router>
    );
  }
}

export default Root;
