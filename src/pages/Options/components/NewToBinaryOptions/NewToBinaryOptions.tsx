import React, { FC } from 'react';
import { Trans } from 'react-i18next';

import Link from 'components/Link';
import { LINKS } from 'constants/links';
import styled from 'styled-components';

type NewToBinaryOptionsProps = {
	className?: string;
};

const NewToBinaryOptions: FC<NewToBinaryOptionsProps> = (props) => (
	<Wrapper {...props}>
		<Trans
			i18nKey="options.common.new-to-binary-options"
			components={[<Link to={LINKS.Blog.HowBinaryOptionsWork} isExternal={true} />]}
		/>
	</Wrapper>
);

const Wrapper = styled.span`
	a {
		color: ${(props) => props.theme.colors.hyperlink};
		text-decoration: underline;
	}
`;

export default NewToBinaryOptions;
