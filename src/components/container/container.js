import React from 'react';
import styles from './container.module.scss';

const Container = ({ children, fullHeight, minHeight, width }) => {
	const inlineStyle = Object.assign({ minHeight: minHeight || 'auto' }, width ? { width } : {});
	return (
		<div
			style={inlineStyle}
			className={`${styles.container} ${fullHeight ? styles.fullHeight : ''}`}
		>
			{children}
		</div>
	);
};

export default Container;
