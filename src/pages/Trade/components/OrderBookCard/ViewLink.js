import React from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { showViewTxModal } from 'src/ducks/ui';

import { ReactComponent as ArrowLinkIcon } from 'src/assets/images/l2/link-arrow.svg';

const ViewLink = ({ hash, showViewTxModal }) =>
	hash == null ? null : (
		<ViewButton onClick={() => showViewTxModal({ hash })}>
			View <ArrowLinkIcon />
		</ViewButton>
	);

const ViewButton = styled.button`
	border: none;
	background: none;
	outline: none;
	cursor: pointer;
	color: ${props => props.theme.colors.hyperlink};
	box-sizing: border-box;
	font-size: 13px;
	${props =>
		props.isDisabled &&
		css`
			opacity: 0.3;
			pointer-events: none;
		`}
`;

export const ArrowIcon = styled(ArrowLinkIcon)``;

const mapDispatchToProps = {
	showViewTxModal,
};

export default connect(null, mapDispatchToProps)(ViewLink);
