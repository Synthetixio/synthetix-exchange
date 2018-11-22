import React, { Component } from 'react';
import styles from './root.module.scss';

class Root extends Component {
  render() {
    return (
      <div className={styles.root}>
        <header className={styles.rootHeader}>
          <p>Synthetix</p>
        </header>
      </div>
    );
  }
}

export default Root;
