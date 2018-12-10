import React from 'react';
import styles from './popup.module.scss';

const Popup = ({ children, isVisible }) => {
  return (
    <div
      className={`${styles.popup} ${isVisible ? styles.popupIsVisible : ''}`}
    >
      <div className={styles.popupInner}>
        <button className={styles.closeButton}>close</button>
      </div>
      {children}
    </div>
  );
};

export default Popup;
