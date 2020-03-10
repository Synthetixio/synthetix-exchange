import { css } from 'styled-components';

// https://github.com/JohnAlbin/styled-media-queries/blob/master/index.js
export const mediaQuery = (...query) => (...rules) =>
	css`
		@media ${css(...query)} {
			${css(...rules)}
		}
	`;

export const breakpoint = {
	small: 480,
	medium: 768,
	large: 1150,
	extraLarge: 1300,
};

export const smallMediaQuery = `(max-width: ${breakpoint.small}px)`;
export const mediumMediaQuery = `(max-width: ${breakpoint.medium - 1}px)`;
export const largeMediaQuery = `(max-width: ${breakpoint.large - 1}px)`;
export const extraLargeMediaQuery = `(max-width: ${breakpoint.extraLarge - 1}px)`;
export const wideMediaQuery = `(min-width: ${breakpoint.extraLarge}px)`;

export const media = {
	small: mediaQuery`${smallMediaQuery}`,
	medium: mediaQuery`${mediumMediaQuery}`,
	large: mediaQuery`${largeMediaQuery}`,
	extraLarge: mediaQuery`${extraLargeMediaQuery}`,
	wide: mediaQuery`${wideMediaQuery}`,
};
