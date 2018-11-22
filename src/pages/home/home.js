import React from 'react';
import styles from './home.module.scss';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.homeContent}>
        <h1>Access traditional financial assets on the Ethereum blockchain.</h1>
        <div>
          <Link to={'/exchange'}>View Exchange</Link>{' '}
          <Link to={'/more'}>Learn More</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
