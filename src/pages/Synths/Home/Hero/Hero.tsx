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
				<HeroTitle>{t('synths.home.hero.title')}</HeroTitle>
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
	max-width: 850px;
	margin: 0 auto;
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

export default Hero;
