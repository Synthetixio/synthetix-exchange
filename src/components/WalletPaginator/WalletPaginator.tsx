import React, { FC } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { Arrow } from '../Icons';
import { DataLarge } from '../Typography';

type PaginatorProps = {
	currentIndex: number;
	disabled: boolean;
	onIndexChange: (index: number) => void;
};

const Paginator: FC<PaginatorProps> = ({ currentIndex, disabled, onIndexChange }) => {
	const { t } = useTranslation();

	return (
		<Wrapper disabled={disabled}>
			<Button
				onClick={() => {
					if (currentIndex > 0) {
						onIndexChange(currentIndex - 1);
					}
				}}
			>
				<Arrow direction="left" />
			</Button>
			<DataLarge>{t('common.pagination.page-number', { pageNumber: currentIndex + 1 })}</DataLarge>
			<Button
				onClick={() => {
					onIndexChange(currentIndex + 1);
				}}
			>
				<Arrow direction="right" />
			</Button>
		</Wrapper>
	);
};

const Wrapper = styled.div<{ disabled: boolean }>`
	width: 100%;
	margin: 30px 0;
	display: flex;
	justify-content: center;
	align-items: center;
	transition: opacity 0.1s ease-out;
	opacity: ${(props) => (props.disabled ? 0.6 : 1)};
	pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
`;

const Button = styled.button<{ active?: boolean }>`
	margin: 0 20px;
	padding: 0;
	border: none;
	width: 24px;
	height: 24px;
	border-radius: 1px;
	background-color: ${(props) =>
		props.active ? props.theme.colors.accentL2 : props.theme.colors.accentL1};
	display: flex;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	transition: all 0.1s ease;
	&:hover {
		background-color: ${(props) => props.theme.colors.accentL2};
	}
`;

export default Paginator;
