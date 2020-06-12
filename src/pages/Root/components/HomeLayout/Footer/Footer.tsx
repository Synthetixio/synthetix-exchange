import React, { FC, memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { bodyMediumCSS } from 'components/Typography/Body';
import Link from 'components/Link';

import { breakpoint, media } from 'shared/media';
import { FlexDivRow } from 'shared/commonStyles';

import { LINKS } from 'constants/links';
import { ROUTES } from 'constants/routes';

import { ReactComponent as TwitterLogoIcon } from 'assets/images/splash/twitter-logo.svg';
import { ReactComponent as MediumLogoIcon } from 'assets/images/splash/medium-logo.svg';
import { ReactComponent as DiscordLogoIcon } from 'assets/images/splash/discord-logo.svg';
import { ReactComponent as GithubLogoIcon } from 'assets/images/splash/github-logo.svg';

import { ReactComponent as MessariLogoIcon } from 'assets/images/splash/messari-logo.svg';
import { ReactComponent as EthereumLogoIcon } from 'assets/images/splash/ethereum-logo.svg';
import { ReactComponent as DefiNetworkLogoIcon } from 'assets/images/splash/defi-network-logo.svg';

const FOOTER_LINKS = [
	{
		i18nTitle: 'home.footer.learn.title',
		links: [
			{
				i18nLabel: 'home.footer.learn.links.litepaper',
				link: LINKS.Learn.Litepaper,
				isExternal: true,
			},
			{
				i18nLabel: 'home.footer.learn.links.tokens',
				link: LINKS.Learn.Tokens,
				isExternal: true,
			},
			{
				i18nLabel: 'home.footer.learn.links.blog',
				link: LINKS.Learn.Blog,
				isExternal: true,
			},
		],
	},
	{
		i18nTitle: 'home.footer.products.title',
		links: [
			{
				i18nLabel: 'home.footer.products.links.synthetix-exchange',
				link: ROUTES.Trade,
				isExternal: false,
			},
			{
				i18nLabel: 'home.footer.products.links.mintr',
				link: LINKS.Products.Mintr,
				isExternal: true,
			},
			{
				i18nLabel: 'home.footer.products.links.dashboard',
				link: LINKS.Products.Dashboard,
				isExternal: true,
			},
		],
	},
	{
		i18nTitle: 'home.footer.connect.title',
		links: [
			{
				i18nLabel: 'home.footer.connect.links.community',
				link: LINKS.Connect.Community,
				isExternal: true,
			},
			{
				i18nLabel: 'home.footer.connect.links.contact-us',
				link: LINKS.Connect.ContactUs,
				isExternal: true,
			},
		],
	},
];

const SOCIAL_LINKS = [
	{
		icon: <TwitterLogoIcon width="24px" height="24px" />,
		link: LINKS.Social.Twitter,
	},
	{
		icon: <MediumLogoIcon width="24px" height="24px" />,
		link: LINKS.Social.Medium,
	},
	{
		icon: <DiscordLogoIcon width="24px" height="24px" />,
		link: LINKS.Social.Discord,
	},
	{
		icon: <GithubLogoIcon width="24px" height="24px" />,
		link: LINKS.Social.GitHub,
	},
];

const MISC_LINKS = [
	{
		icon: <MessariLogoIcon />,
		link: LINKS.Misc.Messari,
	},
	{
		icon: <EthereumLogoIcon />,
		link: LINKS.Misc.EthereumOrg,
	},
	{
		icon: <DefiNetworkLogoIcon />,
		link: LINKS.Misc.DefiNetwork,
	},
];

export const Footer: FC = memo(() => {
	const { t } = useTranslation();

	return (
		<Container>
			<Content>
				<FooterMenu>
					<Menu>
						{FOOTER_LINKS.map(({ i18nTitle, links }) => (
							<div key={i18nTitle}>
								<MenuTitle>{t(i18nTitle)}</MenuTitle>
								<MenuLinkItems>
									{links.map(({ i18nLabel, link, isExternal }) => (
										<MenuLinkItem key={i18nLabel}>
											<FooterLink to={link} isExternal={isExternal}>
												{t(i18nLabel)}
											</FooterLink>
										</MenuLinkItem>
									))}
								</MenuLinkItems>
							</div>
						))}
					</Menu>
					<Social>
						{SOCIAL_LINKS.map(({ icon, link }) => (
							<FooterLink key={link} to={link} isExternal={true}>
								{icon}
							</FooterLink>
						))}
					</Social>
				</FooterMenu>
				<StyledFlexDivRow>
					<MiscLinks>
						{MISC_LINKS.map(({ icon, link }) => (
							<FooterLink key={link} to={link} isExternal={true}>
								{icon}
							</FooterLink>
						))}
					</MiscLinks>
					<VersionLabel>v{process.env.REACT_APP_VERSION}</VersionLabel>
				</StyledFlexDivRow>
			</Content>
		</Container>
	);
});

const Container = styled.footer`
	padding: 68px;
	${media.medium`
		padding: 42px;
	`}
	${media.small`
		padding: 32px;
	`}
`;

const Content = styled.div`
	max-width: ${breakpoint.extraLarge}px;
	margin: 0 auto;
`;

const FooterMenu = styled.div`
	padding-bottom: 100px;
	display: grid;
	grid-template-columns: 1fr auto;
	align-items: flex-start;
	justify-items: flex-start;
	grid-template-areas: 'menu social';
	${media.small`
		padding-bottom: 70px;
		grid-template-columns: initial initial;
		grid-template-rows: auto auto;
		grid-template-areas: 'social' 'menu';
		grid-gap: 70px;
	`};
`;

const MiscLinks = styled.div`
	display: inline-grid;
	grid-template-columns: auto auto auto;
	grid-gap: 24px;
	align-items: center;
	${media.small`
		grid-auto-flow: initial;
		grid-template-columns: auto;
	`}
`;

const Menu = styled.div`
	grid-area: menu;
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 80px;

	${media.medium`
		grid-gap: 50px;
	`}

	${media.small`
		grid-auto-flow: initial;
		grid-template-columns: auto;
	`}
`;

const MenuTitle = styled.div`
	text-transform: uppercase;
	${bodyMediumCSS};
	color: ${(props) => props.theme.colors.white};
	padding-bottom: 25px;
`;

const MenuLinkItems = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;
`;

const MenuLinkItem = styled.li`
	padding-bottom: 12px;
`;

const FooterLink = styled(Link)`
	${bodyMediumCSS};
	color: ${(props) => props.theme.colors.fontSecondary};
	&:hover {
		color: ${(props) => props.theme.colors.white};
	}
`;

const Social = styled.div`
	grid-area: social;
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 15px;
	align-items: center;
`;

const StyledFlexDivRow = styled(FlexDivRow)`
	align-items: center;
	${media.small`
		flex-direction: column;
		align-items: flex-start;
	`}
`;

const VersionLabel = styled.div`
	font-size: 12px;
	color: ${(props) => props.theme.colors.fontPrimary};
	${media.small`
		margin-top: 15px;
	`}
`;

export default Footer;
