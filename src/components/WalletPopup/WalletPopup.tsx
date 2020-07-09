import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { getIsWalletConnected } from 'ducks/wallet/walletDetails';
import { toggleWalletPopup, walletPopupIsVisible } from 'ducks/ui';

import { ReactComponent as CloseCrossIcon } from 'assets/images/close-cross.svg';

import { RootState } from 'ducks/types';

import {
	resetButtonCSS,
	FullScreenModal,
	FullScreenModalContainer,
	FullScreenModalCloseButton,
} from 'shared/commonStyles';

import { labelMediumCSS } from 'components/Typography/Label';

import WalletTypeSelector from './WalletTypeSelector';
import WalletAddressSelector from './WalletAddressSelector';

const mapStateToProps = (state: RootState) => ({
	popupIsVisible: walletPopupIsVisible(state),
	isWalletConnected: getIsWalletConnected(state),
});

const mapDispatchToProps = {
	toggleWalletPopup,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type WalletPopupProps = PropsFromRedux;

type DisplayContent = 'wallet-address-selector' | 'wallet-type-selector';

const WalletPopup: FC<WalletPopupProps> = ({
	popupIsVisible,
	toggleWalletPopup,
	isWalletConnected,
}) => {
	const [displayContent, setContentDisplay] = useState<DisplayContent>('wallet-type-selector');
	const { t } = useTranslation();

	useEffect(() => {
		if (popupIsVisible) {
			setContentDisplay(isWalletConnected ? 'wallet-address-selector' : 'wallet-type-selector');
		}
	}, [popupIsVisible, isWalletConnected]);

	const sharedProps = {
		goBack: () => setContentDisplay('wallet-type-selector'),
		selectAddressScreen: () => setContentDisplay('wallet-address-selector'),
	};

	return (
		<FullScreenModal open={popupIsVisible}>
			<FullScreenModalContainer>
				{displayContent === 'wallet-address-selector' && (
					<BackButton onClick={() => setContentDisplay('wallet-type-selector')}>
						{t('modals.wallet.back-to-wallet-selection')}
					</BackButton>
				)}
				<FullScreenModalCloseButton onClick={() => toggleWalletPopup(false)}>
					<CloseCrossIcon />
				</FullScreenModalCloseButton>
				{displayContent === 'wallet-address-selector' && <WalletAddressSelector {...sharedProps} />}
				{displayContent === 'wallet-type-selector' && <WalletTypeSelector {...sharedProps} />}
			</FullScreenModalContainer>
		</FullScreenModal>
	);
};

const BackButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	left: 5%;
	top: 5%;
	${labelMediumCSS};
	color: ${(props) => props.theme.colors.fontTertiary};
	font-size: 18px;
	&:hover {
		text-decoration: underline;
	}
`;

export default connector(WalletPopup);
