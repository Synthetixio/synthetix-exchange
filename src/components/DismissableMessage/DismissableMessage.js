import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import { Message } from '../../shared/commonStyles';

export const DismissableMessage = ({ children, onDismiss, ...rest }) => (
	<Container>
		<StyledMessage {...rest}>
			{children}
			<StyledCloseButton icon="times" onClick={onDismiss} />
		</StyledMessage>
	</Container>
);

DismissableMessage.propTypes = {
	children: PropTypes.node.isRequired,
	onDismiss: PropTypes.func.isRequired,
};

const Container = styled.div`
	position: relative;
`;

const StyledMessage = styled(Message)`
	justify-content: space-between;
`;

const StyledCloseButton = styled(FontAwesomeIcon)`
	cursor: pointer;
`;

export default DismissableMessage;
