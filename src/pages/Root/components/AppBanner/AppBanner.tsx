import React from 'react';
import styled from 'styled-components';

import { resetButtonCSS } from 'shared/commonStyles';

import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';

import { media } from 'shared/media';

const { APP_BANNER_DISMISSED } = LOCAL_STORAGE_KEYS;

// Since we currently can have only one "active" banner, all we need to do is to keep incrementing
// the BANNER_ID which will be persisted to local storage (no need to keep an array of the banners the user saw)

const BANNER_ID = '2_eth_collat'; // set on 22 June, 2020

const AppBanner = () => {
	const [bannerDismissed, _] = useLocalStorage(APP_BANNER_DISMISSED, null);

	const shouldDisplayBanner = bannerDismissed == null || bannerDismissed !== BANNER_ID;

	return shouldDisplayBanner ? (
		<Container href={'https://kwenta.io'} target="_blank">
			Synthetix Exchange will be deprecated soon, to continue trading use https://kwenta.io
		</Container>
	) : null;
};

const Container = styled.a`
	${resetButtonCSS};
	text-decoration: none;
	background-color: ${(props) => props.theme.colors.buttonDefault};
	color: ${(props) => props.theme.colors.white};
	display: grid;
	grid-template-columns: 1fr auto;
	min-height: 36px;
	justify-items: center;
	align-items: center;
	letter-spacing: 0.2px;
	font-size: 14px;
	text-transform: uppercase;
	width: 100%;
	grid-gap: 10px;
	padding: 2px 12px;
	${media.medium`
		font-size: 12px;
	`}
	${media.small`
		font-size: 11px;
	`}
`;

export default AppBanner;
