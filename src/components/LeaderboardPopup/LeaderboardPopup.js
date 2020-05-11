import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled, { css } from 'styled-components';

import { hideLeaderboardPopup } from 'src/ducks/ui';

import SimpleAppHeader from 'src/pages/Root/components/SimpleAppHeader';
import { Popup } from 'src/shared/commonStyles';

import { ReactComponent as CloseCrossIcon } from 'src/assets/images/close-cross.svg';

import { resetButtonCSS } from 'src/shared/commonStyles';

import { media } from 'src/shared/media';
import { CenteredContent } from 'src/shared/commonStyles';

import UserTradesTable from './UserTradesTable';
import LeaderboardTable from './LeaderboardTable';

const LeaderboardPopup = ({ hideLeaderboardPopup }) => {
	const [selectedUser, setSelectedUser] = useState(null);

	const isOnLeaderboard = selectedUser === null;

	return (
		<Popup>
			<SimpleAppHeader onClick={hideLeaderboardPopup} />
			<Content isOnLeaderboard={isOnLeaderboard}>
				<CloseButton onClick={hideLeaderboardPopup} isOnLeaderboard={isOnLeaderboard}>
					<CloseCrossIcon />
				</CloseButton>
				{selectedUser ? (
					<UserTradesTable selectedUser={selectedUser} onBackButton={() => setSelectedUser(null)} />
				) : (
					<LeaderboardTable setSelectedUser={setSelectedUser} />
				)}
			</Content>
		</Popup>
	);
};

const Content = styled(CenteredContent)`
	height: calc(100vh - 56px);
	overflow: auto;
	justify-content: initial;
	max-width: ${props => (props.isOnLeaderboard ? '600px' : '850px')};
	padding-top: 40px;
	padding-bottom: 20px;
	${media.small`
		padding-top: 0;
	`}
`;

const CloseButton = styled.button`
	${resetButtonCSS};
	position: absolute;
	right: 0;
	top: 50px;
	outline: none;
	svg {
		width: 20px;
		height: 20px;
	}
	${props =>
		props.isOnLeaderboard
			? css`
					top: 50px;
			  `
			: css`
					top: 40px;
			  `}
	${media.small`
		position: fixed;
		right: 10px;
		top: 15px;
	`}
`;

const mapDispatchToProps = {
	hideLeaderboardPopup,
};

export default connect(null, mapDispatchToProps)(LeaderboardPopup);
