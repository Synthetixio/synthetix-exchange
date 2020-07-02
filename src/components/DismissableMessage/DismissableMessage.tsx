import React, { FC } from 'react';
import styled from 'styled-components';

import { ReactComponent as CloseIcon } from 'assets/images/close.svg';

import { Message, MessageProps } from 'shared/commonStyles';

type DismissableMessageProps = MessageProps & {
	children: React.ReactNode;
	onDismiss: () => void;
};

export const DismissableMessage: FC<DismissableMessageProps> = ({
	children,
	onDismiss,
	...rest
}) => (
	<Container>
		<StyledMessage {...rest}>
			{children}
			<StyledCloseButton onClick={onDismiss} />
		</StyledMessage>
	</Container>
);

const Container = styled.div`
	position: relative;
`;

const StyledMessage = styled(Message)`
	justify-content: space-between;
`;

const StyledCloseButton = styled(CloseIcon)`
	cursor: pointer;
`;

export default DismissableMessage;
