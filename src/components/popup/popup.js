import React from 'react';
import styles from './popup.module.scss';

const Popup = ({ children, isVisible, closePopup }) => {
  return (
    <div
      className={`${styles.popup} ${isVisible ? styles.popupIsVisible : ''}`}
    >
      <div className={styles.popupInner}>
        <button onClick={closePopup} className={styles.closeButton}>
          close
        </button>
      </div>
      {children}
    </div>
  );
};

export default Popup;
