import React from 'react';
import WalletWidget from '../wallet-widget';
import styles from './header.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <div>S | Exchange</div>
      <WalletWidget />
    </div>
  );
};

export default Header;
