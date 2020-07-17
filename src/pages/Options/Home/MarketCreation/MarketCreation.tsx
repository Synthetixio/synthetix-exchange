import React, { FC } from 'react';
import styled from 'styled-components';
import { connect, ConnectedProps } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { darkTheme } from 'styles/theme';
import { media } from 'shared/media';
import ROUTES, { navigateTo } from 'constants/routes';

import { RootState } from 'ducks/types';
import { toggleWalletPopup } from 'ducks/ui';
import { getIsWalletConnected } from 'ducks/wallet/walletDetails';

import { Button } from 'components/Button';
import { headingH4CSS } from 'components/Typography/Heading';
import { bodyCSS } from 'components/Typography/General';

import NewToBinaryOptions from 'pages/Options/components/NewToBinaryOptions';

const mapStateToProps = (state: RootState) => ({
	isWalletConnected: getIsWalletConnected(state),
});

const mapDispatchToProps = {
	toggleWalletPopup,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

type MarketCreationProps = PropsFromRedux;

const MarketCreation: FC<MarketCreationProps> = ({ isWalletConnected, toggleWalletPopup }) => {
	const { t } = useTranslation();

	const subTitle = (
		<Subtitle>
			<NewToBinaryOptions />
		</Subtitle>
	);

	return (
		<Container>
			{!isWalletConnected ? (
				<>
					<Title>{t('options.home.market-creation.not-connected.title')}</Title>
					{subTitle}
					<StyledButton palette="primary" onClick={() => toggleWalletPopup(true)}>
						{t('common.wallet.connect-your-wallet')}
					</StyledButton>
				</>
			) : (
				<>
					<Title>{t('options.home.market-creation.no-markets.title')}</Title>
					{subTitle}
					<StyledButton
						palette="primary"
						disabled={true}
						onClick={() => navigateTo(ROUTES.Options.CreateMarketModal)}
					>
						{t('options.home.market-creation.create-market-button-label')}
					</StyledButton>
				</>
			)}
		</Container>
	);
};

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
	padding: 56px;
	${media.medium`
		border: 0;
	`}
`;

const StyledButton = styled(Button)`
	background-color: ${(props) => props.theme.colors.icons};
	padding: 0 50px;
`;

export default connector(MarketCreation);
