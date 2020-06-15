import React, { memo } from 'react';
import styled from 'styled-components';

import { FlexDivCentered, resetButtonCSS } from 'shared/commonStyles';

import { ReactComponent as CloseCrossIcon } from 'assets/images/close-cross.svg';

import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';

const { APP_BANNER_DISMISSED } = LOCAL_STORAGE_KEYS;

// Since we currently can have only one "active" banner, all we need to do is to keep incrementing
// the BANNER_ID which will be persisted to local storage (no need to keep an array of the banners the user saw)

const BANNER_ID = '1_eth_collat'; // set on 15 June, 2020

const AppBanner = memo(() => {
	const [bannerDismissed, setBannerDismissed] = useLocalStorage(APP_BANNER_DISMISSED, null);

	const shouldDisplayBanner = bannerDismissed == null || bannerDismissed !== BANNER_ID;

	return shouldDisplayBanner ? (
		<Container>
			The Ether collateral trial is complete — please close your loans before the APR is raised to
			10% on June 19
			<CloseButton onClick={() => setBannerDismissed(BANNER_ID)}>
				<CloseCrossIcon width={10} />
			</CloseButton>
		</Container>
	) : null;
});

const Container = styled(FlexDivCentered)`
	background-color: ${(props) => props.theme.colors.buttonDefault};
	color: ${(props) => props.theme.colors.white};
	height: 36px;
	display: flex;
	justify-content: center;
	align-items: center;
	letter-spacing: 0.5px;
	font-size: 14px;
	text-transform: uppercase;
	width: 100%;
	position: relative;
`;

const CloseButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	right: 12px;
	color: ${(props) => props.theme.colors.white};
	padding: 0 4px;
`;

export default AppBanner;
