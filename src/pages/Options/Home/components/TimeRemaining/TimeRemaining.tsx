import React, { FC, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import intervalToDuration from 'date-fns/intervalToDuration';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInWeeks from 'date-fns/differenceInWeeks';

import { bodyCSS } from 'components/Typography/General';

import useInterval from 'shared/hooks/useInterval';
import { formattedDuration } from 'utils/formatters';

type TimeRemainingProps = {
	end: Date | number;
	className?: string;
};

const ONE_SECOND_IN_MS = 1000;
const ENDING_SOON_IN_HOURS = 24;

export const TimeRemaining: FC<TimeRemainingProps> = ({ end, ...rest }) => {
	const now = Date.now();
	const timeElapsed = now >= end;
	const endingSoon = Math.abs(differenceInHours(now, end)) < ENDING_SOON_IN_HOURS;
	const weeksDiff = Math.abs(differenceInWeeks(now, end));
	const showRemainingInWeeks = weeksDiff > 4;
	const countdownDisabled = timeElapsed || showRemainingInWeeks;

	const [timeInterval, setTimeInterval] = useState<number | null>(
		countdownDisabled ? null : ONE_SECOND_IN_MS
	);

	const [duration, setDuration] = useState<Duration>(intervalToDuration({ start: now, end }));
	const { t } = useTranslation();

	useInterval(() => {
		if (now <= end) {
			setDuration(intervalToDuration({ start: now, end }));
		} else {
			setTimeInterval(null);
		}
	}, timeInterval);
	console.log(weeksDiff);
	return (
		<Container label={endingSoon ? 'ending-soon' : undefined} {...rest}>
			{timeElapsed
				? t('options.common.time-remaining.ended')
				: showRemainingInWeeks
				? `${weeksDiff} weeks`
				: formattedDuration(duration)}
		</Container>
	);
};

const Container = styled.div<{ label?: 'ending-soon' }>`
	${bodyCSS};
	font-size: 14px;
	color: ${(props) => props.theme.colors.fontPrimary};
	text-align: center;

	${(props) =>
		props.label === 'ending-soon' &&
		css`
			color: ${(props) => props.theme.colors.red};
			background: rgba(255, 0, 0, 0.12);
			border-radius: 2px;
			padding: 4px 15px;
		`}
`;

export default TimeRemaining;
