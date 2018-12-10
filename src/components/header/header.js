import React from 'react';
import WalletAddressSwitcher from '../wallet-address-switcher';
import styles from './header.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <div>S | Exchange</div>
      <WalletAddressSwitcher />
    </div>
  );
};

export default Header;
