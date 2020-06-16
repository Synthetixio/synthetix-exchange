import React, { memo, FC } from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { darkTheme } from 'styles/theme';
import { media } from 'shared/media';
import ROUTES, { navigateTo } from 'constants/routes';

import { RootState } from 'ducks/types';
import { getIsLoggedIn } from 'ducks/wallet/walletDetails';

import { Button } from 'components/Button';
import { headingH4CSS } from 'components/Typography/Heading';
import { bodyCSS } from 'components/Typography/General';

const mapStateToProps = (state: RootState) => ({
	isLoggedIn: getIsLoggedIn(state),
});

const connector = connect(mapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type YourMarketsProps = PropsFromRedux;

const YourMarkets: FC<YourMarketsProps> = memo(({ isLoggedIn }) => {
	const { t } = useTranslation();

	return (
		<Container>
			{!isLoggedIn ? (
				<div>Please login to create markets</div>
			) : (
				<>
					<Title>{t('options.home.your-markets.no-markets.title')}</Title>
					<Subtitle>{t('options.home.your-markets.no-markets.subtitle')}</Subtitle>
					<StyledButton
						palette="primary"
						onClick={() => navigateTo(ROUTES.Options.CreateMarketModal)}
					>
						{t('options.home.your-markets.create-market-button-label')}
					</StyledButton>
				</>
			)}
		</Container>
	);
});

const Title = styled.div`
	${headingH4CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	padding-bottom: 15px;
`;

const Subtitle = styled.div`
	${bodyCSS};
	color: ${darkTheme.colors.accentL1};
	padding-bottom: 32px;
`;

const Container = styled.div`
	width: 100%;
	background-color: ${(props) => props.theme.colors.surfaceL2};
	border: 1px solid ${(props) => props.theme.colors.accentL2};
	text-align: center;
	padding: 23px 54px;
	${media.medium`
		border: 0;
	`}
`;

const StyledButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.icons};
	padding: 0 50px;
`;

export default connector(YourMarkets);
