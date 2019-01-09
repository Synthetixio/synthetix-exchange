import React from 'react';
import WalletAddressSwitcher from '../wallet-address-switcher';
import styles from './header.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logoWrapper}>
        <img height="36" alt="logo" src="/images/synthetix-logo.svg" />
        <span className={styles.beta}>[beta]</span>
      </div>
      <WalletAddressSwitcher />
    </div>
  );
};

export default Header;
