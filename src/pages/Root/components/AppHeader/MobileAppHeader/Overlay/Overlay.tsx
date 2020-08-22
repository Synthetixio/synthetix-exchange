import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { media } from 'shared/media';
import { APP_HEADER_HEIGHT, MOBILE_APP_HEADER_HEIGHT, Z_INDEX } from 'constants/ui';

type OverlayProps = {
	onClick: () => void;
};

export const Overlay: FC<OverlayProps> = ({ onClick }) =>
	ReactDOM.createPortal(<Container onClick={onClick} />, document.body);

const Container = styled.div`
	top: ${APP_HEADER_HEIGHT};
	bottom: 0;
	left: 0;
	right: 0;
	position: fixed;
	background-color: ${(props) => props.theme.colors.surfaceL1};
	z-index: ${Z_INDEX.BASE};
	${media.small`
		top: ${MOBILE_APP_HEADER_HEIGHT}
	`}
`;

export default Overlay;
