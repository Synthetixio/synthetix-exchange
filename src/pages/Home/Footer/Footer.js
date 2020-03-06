import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { bodyMediumCSS, bodyMediumSecondaryCSS } from 'src/components/Typography/Body';
import Link from 'src/components/Link';

import { FlexDivRow } from 'src/shared/commonStyles';

import { breakpoint, media } from 'src/shared/media';

import { LINKS } from 'src/constants/links';
import { ROUTES } from 'src/constants/routes';

import { ReactComponent as TwitterLogoIcon } from 'src/assets/images/splash/twitter-logo.svg';
import { ReactComponent as MediumLogoIcon } from 'src/assets/images/splash/medium-logo.svg';
import { ReactComponent as DiscordLogoIcon } from 'src/assets/images/splash/discord-logo.svg';
import { ReactComponent as GithubLogoIcon } from 'src/assets/images/splash/github-logo.svg';

import { ReactComponent as MessariLogoIcon } from 'src/assets/images/splash/messari-logo.svg';
import { ReactComponent as EthereumLogoIcon } from 'src/assets/images/splash/ethereum-logo.svg';
import { ReactComponent as DefiNetworkLogoIcon } from 'src/assets/images/splash/defi-network-logo.svg';

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
		icon: <MessariLogoIcon width="152px" height="52px" />,
		link: LINKS.Misc.Messari,
	},
	{
		icon: <EthereumLogoIcon width="184px" height="47px" />,
		link: LINKS.Misc.EthereumOrg,
	},
	{
		icon: <DefiNetworkLogoIcon width="133px" height="47px" />,
		link: LINKS.Misc.DefiNetwork,
	},
];

export const Footer = memo(() => {
	const { t } = useTranslation();

	return (
		<Container>
			<Content>
				<FooterMenu>
					<Menu>
						{FOOTER_LINKS.map(({ i18nTitle, links }) => (
							<MenuItem key={i18nTitle}>
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
							</MenuItem>
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
				<MiscLinks>
					{MISC_LINKS.map(({ icon, link }) => (
						<FooterLink key={link} to={link} isExternal={true}>
							{icon}
						</FooterLink>
					))}
				</MiscLinks>
			</Content>
		</Container>
	);
});

const Container = styled.footer`
	padding: 70px;
`;

const Content = styled.div`
	max-width: ${breakpoint.large};
	margin: 0 auto;
`;

const FooterMenu = styled(FlexDivRow)`
	align-items: flex-start;
	padding-bottom: 115px;
`;

const MiscLinks = styled.div`
	display: grid;
	grid-template-columns: 1fr auto auto;
	grid-gap: 20px;
	align-items: center;
	${media.medium`
		grid-auto-flow: initial;
		grid-template-columns: auto;
	`}
`;

const Menu = styled.div`
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 80px;

	${media.medium`
		grid-auto-flow: initial;
		grid-template-columns: auto;
	`}
`;

const MenuItem = styled.div``;

const MenuTitle = styled.div`
	text-transform: uppercase;
	${bodyMediumCSS};
	padding-bottom: 25px;
`;

const MenuLinkItems = styled.ul`
	margin: 0;
	padding: 0;
`;

const MenuLinkItem = styled.li`
	padding-bottom: 12px;
`;

const FooterLink = styled(Link)`
	${bodyMediumSecondaryCSS};
	&:hover {
		color: ${props => props.theme.colors.white};
	}
`;

const Social = styled.div`
	display: inline-grid;
	grid-auto-flow: column;
	grid-gap: 15px;
	align-items: center;
`;

export default Footer;
