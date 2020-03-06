import React, { memo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { HeadingLarge } from 'src/components/Typography/Heading';

import { darkTheme } from 'src/styles/theme';

export const Hero = memo(() => {
	const { t } = useTranslation();

	return (
		<Container>
			<Content>
				<HeroTitle>{t('home.hero.title')}</HeroTitle>
				<HeroSubtitle>{t('home.hero.subtitle')}</HeroSubtitle>
			</Content>
		</Container>
	);
});

const Container = styled.div`
	height: 448px;
	background-color: ${darkTheme.colors.surfaceL1};
	width: 100%;
	text-align: center;
	padding: 155px;
`;

const Content = styled.div`
	margin: 0 auto;
`;

const HeroTitle = styled(HeadingLarge)`
	color: ${darkTheme.colors.fontPrimary};
	padding-bottom: 24px;
`;

const HeroSubtitle = styled.div`
	font-size: 24px;
	color: ${darkTheme.colors.fontTertiary};
	font-family: ${props => props.theme.fonts.regular};
`;

export default Hero;
