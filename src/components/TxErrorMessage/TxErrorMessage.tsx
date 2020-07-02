import React, { FC } from 'react';
import styled from 'styled-components';

import DismissableMessage from 'components/DismissableMessage';

type TxErrorMessageProps = {
	children: React.ReactNode;
	onDismiss: () => void;
};

export const TxErrorMessage: FC<TxErrorMessageProps> = ({ children, onDismiss, ...rest }) => (
	<ErrorMessage type="error" size="sm" floating={true} onDismiss={onDismiss} {...rest}>
		{children}
	</ErrorMessage>
);

const ErrorMessage = styled(DismissableMessage)`
	margin-top: 8px;
`;

export default TxErrorMessage;
