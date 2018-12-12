import React from 'react';
import WalletAddressSwitcher from '../wallet-address-switcher';
import styles from './header.module.scss';

const Header = () => {
  return (
    <div className={styles.header}>
      <img height="36" src="/images/synthetix-logo.svg" />
      <WalletAddressSwitcher />
    </div>
  );
};

export default Header;
