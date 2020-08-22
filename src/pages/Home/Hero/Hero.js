import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { headingH2CSS } from 'components/Typography/Heading';
import { media } from 'shared/media';
import { darkTheme } from 'styles/theme';

export const Hero = () => {
	const { t } = useTranslation();

	return (
		<Container>
			<Content>
				<HeroTitle>{t('home.hero.title')}</HeroTitle>
				<HeroSubtitle>{t('home.hero.subtitle')}</HeroSubtitle>
			</Content>
		</Container>
	);
};

const Container = styled.div`
	width: 100%;
	text-align: center;

	padding: 125px 24px 0 24px;
	${media.large`
		padding: 80px 24px 0 24px;
	`}
	${media.medium`
		padding: 45px 24px 0 24px;
	`}
`;

const Content = styled.div`
	margin: 0 auto;
`;

const HeroTitle = styled.div`
	${headingH2CSS};
	color: ${darkTheme.colors.fontPrimary};
	padding-bottom: 24px;
	${media.large`
		font-size: 40px;
		line-height: 40px;
	`}
	${media.medium`
		font-size: 32px;
		line-height: 32px;
	`}
`;

const HeroSubtitle = styled.div`
	font-size: 24px;
	color: ${darkTheme.colors.fontTertiary};
	font-family: ${(props) => props.theme.fonts.regular};
	${media.large`
		font-size: 16px;
	`}
	${media.medium`
		font-size: 14px;
	`}
`;

export default Hero;
