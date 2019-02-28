import React from 'react';
import styles from './container.module.scss';

const Container = ({ children, fullHeight, minHeight }) => {
  return (
    <div
      style={{ minHeight: minHeight || 'auto' }}
      className={`${styles.container} ${fullHeight ? styles.fullHeight : ''}`}
    >
      {children}
    </div>
  );
};

export default Container;
