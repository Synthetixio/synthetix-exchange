import React, { FC } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import styled from 'styled-components';

import { GridDivCenteredCol, CurrencyKey } from 'shared/commonStyles';
import Card from 'components/Card';
import { headingH5CSS } from 'components/Typography/Heading';
import { bodyCSS } from 'components/Typography/General';
import { SYNTHS_MAP, CRYPTO_CURRENCY_MAP } from 'constants/currency';
import { Button } from 'components/Button';
import ROUTES, { navigateTo } from 'constants/routes';
import { LINKS } from 'constants/links';
import Link from 'components/Link';

type BannerProps = {
	hasMarkets: boolean;
	noSUSD: boolean;
};

const Banner: FC<BannerProps> = ({ hasMarkets, noSUSD }) => {
	const { t } = useTranslation();

	let title;
	let subTitle = (
		<Trans
			i18nKey="assets.options.banner.common.subtitle"
			components={[<Link to={LINKS.Blog.HowBinaryOptionsWork} isExternal={true} />]}
		/>
	);

	if (hasMarkets) {
		title = t('assets.options.banner.has-markets.title');
		subTitle = t('assets.options.banner.has-markets.subtitle');
	} else if (noSUSD) {
		title = t('assets.options.banner.no-susd.title', { currencyKey: SYNTHS_MAP.sUSD });
	} else {
		title = t('assets.options.banner.no-markets.title');
	}
	return (
		<Card>
			<StyledCardBody>
				<div>
					<Title>{title}</Title>
					<Subtitle>{subTitle}</Subtitle>
				</div>
				<Buttons>
					{noSUSD ? (
						<>
							<Link
								to={LINKS.Trading.OneInchLink(SYNTHS_MAP.sUSD, CRYPTO_CURRENCY_MAP.ETH)}
								isExternal={true}
							>
								<Button palette="primary" size="md">
									<Trans
										i18nKey="common.currency.buy-currency"
										values={{ currencyKey: SYNTHS_MAP.sUSD }}
										components={[<CurrencyKey />]}
									/>
								</Button>
							</Link>
							<Button palette="primary" size="md" onClick={() => navigateTo(ROUTES.Trade)}>
								<Trans
									i18nKey="common.currency.trade-synths-for-currency"
									values={{ currencyKey: SYNTHS_MAP.sUSD }}
									components={[<CurrencyKey />]}
								/>
							</Button>
						</>
					) : (
						<>
							<Button palette="primary" size="md" onClick={() => navigateTo(ROUTES.Options.Home)}>
								{t('assets.options.banner.common.buttons.view-all-markets-label')}
							</Button>
							<Button
								palette="primary"
								size="md"
								onClick={() => navigateTo(ROUTES.Assets.Options.CreateMarketModal)}
							>
								{t('assets.options.banner.common.buttons.create-new-market-label')}
							</Button>
						</>
					)}
				</Buttons>
			</StyledCardBody>
		</Card>
	);
};

const StyledCardBody = styled(Card.Body)`
	display: flex;
	padding: 25px;
	justify-content: space-between;
	background-color: ${(props) => props.theme.colors.surfaceL3};
`;

const Title = styled.div`
	${headingH5CSS};
	color: ${(props) => props.theme.colors.fontPrimary};
	padding-bottom: 6px;
`;
const Subtitle = styled.div`
	${bodyCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	a {
		color: ${(props) => props.theme.colors.hyperlink};
		text-decoration: underline;
	}
`;
const Buttons = styled(GridDivCenteredCol)`
	grid-gap: 24px;
	button {
		/* max-width: 240px; */
	}
`;

export default Banner;
