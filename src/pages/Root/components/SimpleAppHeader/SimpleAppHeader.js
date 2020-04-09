import React from 'react';
import styled from 'styled-components';

import Link from 'src/components/Link';

import { ROUTES } from 'src/constants/routes';
import Logo from '../AppHeader/Logo';

const SimpleAppHeader = ({ onClick }) => (
	<Header onClick={onClick}>
		<HeaderContent>
			<Link to={ROUTES.Home}>
				<Logo />
			</Link>
		</HeaderContent>
	</Header>
);

const Header = styled.div`
	height: 56px;
`;

const HeaderContent = styled.div`
	padding: 0 16px;
	display: flex;
	height: 100%;
	width: 100%;
	align-items: center;
`;

export default SimpleAppHeader;
