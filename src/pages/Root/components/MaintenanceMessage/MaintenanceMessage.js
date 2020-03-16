import React from 'react';
import styled from 'styled-components';

import { HeadingMedium } from 'src/components/Typography';

const MaintenanceMessage = () => (
	<Container>
		<HeadingMedium style={{ color: 'black' }}>
			Synthetix.Exchange is currently down for maintenance.
		</HeadingMedium>
		<HeadingMedium style={{ color: 'black' }}>It will be back shortly.</HeadingMedium>
	</Container>
);

const Container = styled.div`
	position: absolute;
	width: 100%;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	text-align: center;
`;

export default MaintenanceMessage;
