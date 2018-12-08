import React, { Component } from 'react';
import Header from '../../components/header';
import Container from '../../components/container';
import styles from './root.module.scss';

class Root extends Component {
  render() {
    return (
      <div>
        <div>header</div>
        <div className={styles.rootLayout}>
          <Container>
            <div>balance</div>
          </Container>
          <Container>
            <div>wallet connector</div>
          </Container>
          <Container>
            <div>chart</div>
            <div>list</div>
          </Container>
        </div>
      </div>
    );
  }
}

export default Root;
