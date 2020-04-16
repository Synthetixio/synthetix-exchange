import React, { memo, FC } from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { breakpoint } from 'shared/media';
import { lightTheme } from 'styles/theme';

import TokensTable from './TokensTable';

export const TokensSection: FC = memo(() => (
	<>
		<ThemeProvider theme={lightTheme}>
			<TokensTableContainer>
				<Content>
					<TokensTable />
				</Content>
			</TokensTableContainer>
		</ThemeProvider>
	</>
));

const TokensTableContainer = styled.div`
	background-color: ${({ theme }) => theme.colors.white};
	position: relative;
	padding-top: 120px;
`;

const Content = styled.div`
	max-width: ${breakpoint.large}px;
	margin: 0 auto;
`;

export default TokensSection;
