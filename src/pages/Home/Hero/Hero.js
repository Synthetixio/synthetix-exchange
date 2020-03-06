import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { darkTheme } from '../../../styles/theme';

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
	height: 448px;
	background-color: ${darkTheme.colors.surfaceL1};
	width: 100%;
	text-align: center;
	padding: 155px;
`;

const Content = styled.div`
	margin: 0 auto;
`;

const HeroTitle = styled.div`
	font-size: 56px;
	color: ${props => props.theme.colors.white};
	font-family: ${props => props.theme.fonts.medium};
	padding-bottom: 24px;
`;

const HeroSubtitle = styled.div`
	font-size: 18px;
	color: ${props => props.theme.colors.fontTertiary};
	font-family: ${props => props.theme.fonts.regular};
`;

export default Hero;
