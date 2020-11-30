import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import { media } from 'shared/media';
import { getEthereumNetwork, NetworkId, SUPPORTED_NETWORKS } from 'utils/networkUtils';
import { updateNetworkSettings } from 'ducks/wallet/walletDetails';
import { connect, ConnectedProps } from 'react-redux';

const mapDispatchToProps = {
	updateNetworkSettings,
};

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

const AppBanner: FC<PropsFromRedux> = ({ updateNetworkSettings }) => {
	const [showBanner, setShowBanner] = useState<boolean>(false);

	useEffect(() => {
		const checkNetwork = async () => {
			const { networkId } = await getEthereumNetwork();
			if (networkId !== 42) {
				setShowBanner(true);
			}
		};
		checkNetwork();
		// @ts-ignore
		window.ethereum.on('networkChanged', (_networkId: string) => {
			const networkId = Number(_networkId) as NetworkId;

			// TODO: this isn't the "right" place for it... but does the job of showing correct network.
			updateNetworkSettings({ networkId, networkName: SUPPORTED_NETWORKS[networkId] });

			if (networkId !== 42) {
				setShowBanner(true);
			} else {
				setShowBanner(false);
			}
		});

		return () => {
			// @ts-ignore
			window.ethereum.off('networkChanged');
		};
		// eslint-disable-next-line
	}, []);

	return showBanner ? <Container>Please switch to KOVAN network</Container> : null;
};

const Container = styled.div`
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

export default connector(AppBanner);
