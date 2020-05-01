import React from 'react';
import Select from 'react-select';
import { withTheme } from 'styled-components';

const IndicatorSeparator = () => {
	return null;
};

const SimpleSelect = (props) => {
	const {
		theme: { colors },
		isDisabled,
	} = props;
	return (
		<Select
			styles={{
				container: (provided) => ({
					...provided,
					opacity: isDisabled ? 0.4 : 1,
					backgroundColor: colors.accentL1,
				}),
				singleValue: (provided) => ({
					...provided,
					color: colors.fontPrimary,
					boxShadow: 'none',
					fontSize: '14px',
					border: 'none',
				}),
				control: (provided) => ({
					...provided,
					color: colors.fontPrimary,
					cursor: 'pointer',
					boxShadow: 'none',
					border: `1px solid ${colors.accentL2}`,
					borderRadius: '1px',
					outline: 'none',
				}),
				menu: (provided) => ({
					...provided,
					backgroundColor: colors.accentL1,
					border: `1px solid ${colors.accentL2}`,
					borderRadius: '1px',
				}),
				menuList: (provided) => ({
					...provided,
					borderRadius: '3px',
					paddingBottom: 0,
					paddingTop: 0,
					textAlign: 'left',
				}),
				option: (provided) => ({
					...provided,
					color: colors.fontPrimary,
					cursor: 'pointer',
					fontSize: '14px',
					backgroundColor: colors.accentL1,
					'&:hover': {
						backgroundColor: colors.accentL2,
					},
				}),
			}}
			components={{ IndicatorSeparator }}
			{...props}
		></Select>
	);
};

export default withTheme(SimpleSelect);
