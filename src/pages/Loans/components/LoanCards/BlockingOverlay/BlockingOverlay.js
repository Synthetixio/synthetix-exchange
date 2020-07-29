import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { ButtonPrimary } from 'components/Button';
import { HeadingSmall } from 'components/Typography';
import Link from 'components/Link';
import { FlexDivCentered } from 'shared/commonStyles';

const ETHER_COLLATERAL_BLOG_POST_LINK = 'https://blog.synthetix.io/bug-disclosure/';

const BlockingOverlay = () => {
	const { t } = useTranslation();
	return (
		<OverlayContainer>
			<PauseMessage>
				<HeadingSmall>{t('loans.loan-card.create-loan.paused.message')}</HeadingSmall>
			</PauseMessage>
			<Link to={ETHER_COLLATERAL_BLOG_POST_LINK} isExternal={true}>
				<ButtonPrimary size="sm">
					{t('loans.loan-card.create-loan.paused.button-label')}
				</ButtonPrimary>
			</Link>
		</OverlayContainer>
	);
};

const OverlayContainer = styled(FlexDivCentered)`
	background-color: ${(props) => props.theme.colors.surfaceL2};
	width: 100%;
	height: 100%;
	position: absolute;
	left: 0;
	top: 0;
	flex-direction: column;
	justify-content: center;
`;

const PauseMessage = styled.div`
	padding-bottom: 30px;
`;

export default BlockingOverlay;
