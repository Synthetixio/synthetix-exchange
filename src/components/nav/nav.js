import React from 'react';
import { Link } from 'react-router-dom';
import styles from './nav.module.scss';

const Nav = () => {
  return (
    <div className={styles.nav}>
      <div className={styles.navLogo}>
        <Link to={'/'}>SYNTHETIX</Link>
      </div>
      <div className={styles.navRight}>
        <ul className={styles.navLinks}>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/how-it-works">How it works</Link>
          </li>
          <li>
            <Link to="/markets">Markets</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Nav;
