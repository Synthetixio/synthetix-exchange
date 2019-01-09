import React from 'react';
import styles from './container.module.scss';

const Container = ({ children, small }) => {
  return <div className={styles.container}>{children}</div>;
};

export default Container;
