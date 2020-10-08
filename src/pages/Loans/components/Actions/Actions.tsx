import Card from 'components/Card';
import { Button } from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import { HeadingSmall } from 'components/Typography';

interface ActionsProps {
	onActionPress: Function;
	isInteractive: boolean;
}

export const ActionTypes = {
	ADD: 'add',
	WITHDRAW: 'withdraw',
	REPAY: 'repay',
	CLOSE: 'close',
};

const Actions: React.FC<ActionsProps> = ({ onActionPress, isInteractive }) => {
	const { t } = useTranslation();
	return (
		<>
			{!isInteractive ? (
				<Card.Header>
					<HeadingSmall>{t('loans.loan-card.select-loan.title')}</HeadingSmall>
				</Card.Header>
			) : (
				<Card.Header>
					<HeadingSmall>{t('loans.loan-card.actions.title')}</HeadingSmall>
				</Card.Header>
			)}
			<StyledCard isInteractive={isInteractive}>
				<Card.Body>
					<StyledButton size="lg" palette="tab" onClick={() => onActionPress('add')}>
						{t('loans.loan-card.actions.add')}
					</StyledButton>
					<StyledButton size="lg" palette="tab" onClick={() => onActionPress('withdraw')}>
						{t('loans.loan-card.actions.withdraw')}
					</StyledButton>
					<StyledButton size="lg" palette="tab" onClick={() => onActionPress('repay')}>
						{t('loans.loan-card.actions.repay')}
					</StyledButton>
					<StyledButton size="lg" palette="tab" onClick={() => onActionPress('close')}>
						{t('loans.loan-card.actions.close')}
					</StyledButton>
				</Card.Body>
			</StyledCard>
		</>
	);
};

const StyledCard = styled<any>(Card)`
	${(props) =>
		!props.isInteractive &&
		css`
			opacity: 0.3;
			pointer-events: none;
		`}
`;

const StyledButton = styled(Button)`
	width: 100%;
	color: ${(props) => props.theme.colors.white};
	margin-bottom: 16px;
	text-transform: capitalize;
`;

export default Actions;
