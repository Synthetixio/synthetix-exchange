import React, { FC, memo } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { media } from 'shared/media';
import { APP_HEADER_HEIGHT, MOBILE_APP_HEADER_HEIGHT, Z_INDEX } from 'constants/ui';

type DropdownProps = {
	children: React.ReactNode;
};

export const Dropdown: FC<DropdownProps> = memo(({ children, ...rest }) =>
	ReactDOM.createPortal(<Container {...rest}>{children}</Container>, document.body)
);

const Container = styled.div`
	top: ${APP_HEADER_HEIGHT};
	width: 100%;
	position: fixed;
	background-color: ${(props) => props.theme.colors.surfaceL3};
	z-index: ${Z_INDEX.BASE};
	${media.small`
		top: ${MOBILE_APP_HEADER_HEIGHT}
	`}
`;

export default Dropdown;
