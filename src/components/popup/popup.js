import React from 'react';
import styles from './popup.module.scss';

const Popup = ({ children, isVisible, closePopup, hideCloseButton }) => {
	return (
		<div className={`${styles.popup} ${isVisible ? styles.popupIsVisible : ''}`}>
			<div className={styles.popupInner}>
				{hideCloseButton ? null : (
					<button onClick={closePopup} className={styles.closeButton}>
						close
					</button>
				)}
			</div>
			{children}
		</div>
	);
};

export default Popup;
