import React, { memo, FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { OptionsMarkets } from 'ducks/options/types';
import { headingH4CSS } from 'components/Typography/Heading';

import MarketsTable from '../MarketsTable';

type Props = {
	optionsMarkets: OptionsMarkets;
};

type ExploreMarketsProps = Props;

const ExploreMarkets: FC<ExploreMarketsProps> = memo(({ optionsMarkets }) => {
	const { t } = useTranslation();

	return (
		<Container>
			<Title>{t('options.home.explore-markets.title')}</Title>
			<MarketsTable optionsMarkets={optionsMarkets} />
		</Container>
	);
});

const Container = styled.div``;

const Title = styled.div`
	${headingH4CSS};
	color: ${(props) => props.theme.colors.brand};
	padding-bottom: 32px;
`;

export default ExploreMarkets;
