import React, { FC } from 'react';

import { Link as RouterLink, ExternalLink } from 'shared/commonStyles';

type LinkProps = {
	to: string;
	isExternal?: boolean;
};

export const Link: FC<LinkProps> = ({ to, isExternal, ...rest }) =>
	isExternal ? <ExternalLink href={to} {...rest} /> : <RouterLink to={to} {...rest} />;

export default Link;
