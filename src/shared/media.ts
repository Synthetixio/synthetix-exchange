import { css } from 'styled-components';

const cssUntyped = css as any;

// https://github.com/JohnAlbin/styled-media-queries/blob/master/index.js
export const mediaQuery = (...query: any) => (...rules: any) =>
	cssUntyped`
		@media ${cssUntyped(...query)} {
			${cssUntyped(...rules)}
		}
	`;

export const breakpoint = {
	small: 480,
	medium: 768,
	large: 1150,
	extraLarge: 1300,
};

export const smallMediaQuery = `(max-width: ${breakpoint.small}px)`;
export const mediumMediaQuery = `(max-width: ${breakpoint.medium}px)`;
export const largeMediaQuery = `(max-width: ${breakpoint.large}px)`;
export const extraLargeMediaQuery = `(max-width: ${breakpoint.extraLarge}px)`;
export const wideMediaQuery = `(min-width: ${breakpoint.extraLarge}px)`;

export const media = {
	small: mediaQuery`${smallMediaQuery}`,
	medium: mediaQuery`${mediumMediaQuery}`,
	large: mediaQuery`${largeMediaQuery}`,
	extraLarge: mediaQuery`${extraLargeMediaQuery}`,
	wide: mediaQuery`${wideMediaQuery}`,
};
