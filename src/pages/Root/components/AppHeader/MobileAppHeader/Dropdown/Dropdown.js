import React, { memo } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { media } from 'src/shared/media';
import { APP_HEADER_HEIGHT, MOBILE_APP_HEADER_HEIGHT, Z_INDEX } from 'src/constants/ui';

export const Dropdown = memo(({ children, ...rest }) =>
	ReactDOM.createPortal(<Container {...rest}>{children}</Container>, document.body)
);

Dropdown.propTypes = {
	children: PropTypes.node.isRequired,
};

const Container = styled.div`
	top: ${APP_HEADER_HEIGHT};
	width: 100%;
	position: fixed;
	background-color: ${props => props.theme.colors.surfaceL3};
	z-index: ${Z_INDEX.BASE};
	${media.small`
		top: ${MOBILE_APP_HEADER_HEIGHT}
	`}
`;

export default Dropdown;
