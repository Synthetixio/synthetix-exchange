import React, { FC, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';

import intervalToDuration from 'date-fns/intervalToDuration';
import differenceInHours from 'date-fns/differenceInHours';
import differenceInWeeks from 'date-fns/differenceInWeeks';

import { bodyCSS } from 'components/Typography/General';

import useInterval from 'shared/hooks/useInterval';
import { formattedDuration } from 'utils/formatters';

type Palette = 'light' | 'high-contrast';

type TimeRemainingProps = {
	end: Date | number;
	className?: string;
	onEnded?: () => void;
	palette?: Palette;
};

const ONE_SECOND_IN_MS = 1000;
const ENDING_SOON_IN_HOURS = 48;

export const TimeRemaining: FC<TimeRemainingProps> = ({
	end,
	onEnded,
	palette = 'light',
	...rest
}) => {
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

	useEffect(() => {
		if (onEnded && timeElapsed) {
			onEnded();
		}
	}, [onEnded, timeElapsed]);

	useInterval(() => {
		if (now <= end) {
			setDuration(intervalToDuration({ start: now, end }));
		} else {
			setTimeInterval(null);
		}
	}, timeInterval);

	return (
		<Container isLabel={endingSoon ? 'ending-soon' : undefined} palette={palette} {...rest}>
			{timeElapsed
				? t('options.common.time-remaining.ended')
				: showRemainingInWeeks
				? `${weeksDiff} weeks`
				: formattedDuration(duration)}
		</Container>
	);
};

type ContainerProps = { isLabel?: 'ending-soon'; palette?: Palette };

const Container = styled.div<ContainerProps>`
	${bodyCSS};
	font-size: 14px;
	color: ${(props) => props.theme.colors.fontPrimary};
	text-align: center;

	${(props) =>
		props.isLabel === 'ending-soon' &&
		css`
			border-radius: 2px;
			padding: 4px 15px;
			${(props: ContainerProps) =>
				props.palette && props.palette === 'high-contrast'
					? css`
							color: ${(props) => props.theme.colors.surfaceL1};
							background: ${(props) => props.theme.colors.red};
					  `
					: css`
							color: ${(props) => props.theme.colors.red};
							background: rgba(255, 0, 0, 0.12);
					  `}
		`}
`;

export default TimeRemaining;
