import React from 'react';
import styles from './container.module.scss';

const Container = ({ children, fullHeight }) => {
  return (
    <div
      className={`${styles.container} ${fullHeight ? styles.fullHeight : ''}`}
    >
      {children}
    </div>
  );
};

export default Container;
