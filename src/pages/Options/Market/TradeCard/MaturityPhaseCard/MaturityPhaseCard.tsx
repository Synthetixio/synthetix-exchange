import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';

import { OptionsMarketInfo } from 'ducks/options/types';

import Card from 'components/Card';

type MaturityPhaseCardProps = {
	optionsMarket: OptionsMarketInfo;
};

const MaturityPhaseCard: FC<MaturityPhaseCardProps> = memo(({ optionsMarket }) => {
	const { t } = useTranslation();

	return (
		<Card>
			<Card.Header>Maturity</Card.Header>
			<Card.Body>Maturity</Card.Body>
		</Card>
	);
});

export default MaturityPhaseCard;
