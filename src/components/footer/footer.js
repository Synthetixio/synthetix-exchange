import React from 'react';
import styles from './footer.module.scss';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <img className={styles.footerImg} src="images/eth-sticker.svg" />
    </div>
  );
};

export default Footer;
