import React from 'react';
import styles from './spinner.module.scss';

const Spinner = () => {
  return (
    <div className={styles.spinner}>
      <img src="images/spinner.png" alt="spinner" />
    </div>
  );
};

export default Spinner;
