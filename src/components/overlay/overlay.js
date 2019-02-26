import React from 'react';
import styles from './overlay.module.scss';

const Overlay = ({ isVisible }) => {
  return (
    <div
      className={`${styles.overlay} ${
        isVisible ? styles.overlayIsVisible : ''
      }`}
    />
  );
};

export default Overlay;
