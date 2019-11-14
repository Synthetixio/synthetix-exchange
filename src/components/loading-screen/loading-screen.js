import React from 'react';
import Popup from '../popup';
import Spinner from '../spinner';
import styles from './loading-screen.module.scss';

const LoadingScreen = ({ isVisible }) => {
	return (
		<div className={`${styles.loadingScreen} ${isVisible ? styles.loadingScreenIsVisible : ''}`}>
			<Popup isVisible={true} hideCloseButton={true}>
				<div className={styles.popupInner}>
					<h2>Please wait...</h2>
					<Spinner small={true} />
				</div>
			</Popup>
		</div>
	);
};

export default LoadingScreen;
