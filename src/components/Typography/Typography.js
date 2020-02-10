import React from 'react';
import PropTypes from 'prop-types';

import { HeadingMedium, HeadingSmall } from './Heading';
import { DataLarge, DataMedium, DataSmall } from './Data';
import { BodyMedium } from './Body';
import { LabelMedium, LabelSmall } from './Label';

export const Typography = ({ children, variant, size, ...rest }) => {
	let ChosenComponent = BodyMedium;

	if (variant === 'heading') {
		ChosenComponent = size === 'md' ? HeadingMedium : HeadingSmall;
	} else if (variant === 'data') {
		if (size === 'lg') {
			ChosenComponent = DataLarge;
		} else if (size === 'md') {
			ChosenComponent = DataMedium;
		} else {
			ChosenComponent = DataSmall;
		}
	} else if (variant === 'body') {
		ChosenComponent = BodyMedium;
	} else if (variant === 'label') {
		ChosenComponent = size === 'md' ? LabelMedium : LabelSmall;
	}

	return <ChosenComponent {...rest}>{children}</ChosenComponent>;
};

Typography.propTypes = {
	variant: PropTypes.oneOf(['heading', 'data', 'body', 'label']),
	size: PropTypes.oneOf(['sm', 'md', 'lg']),
};
