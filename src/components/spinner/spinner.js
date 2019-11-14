import React from 'react';
import PropTypes from 'prop-types';

import styles from './spinner.module.scss';

const Spinner = ({ small }) => {
	return (
		<div className={styles.spinner}>
			<img src={small ? 'images/spinner-small.png' : 'images/spinner.png'} alt="spinner" />
		</div>
	);
};

Spinner.propTypes = {
	small: PropTypes.bool,
};

export default Spinner;
