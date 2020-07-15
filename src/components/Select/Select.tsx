import React, { FC, useContext, useMemo } from 'react';
import ReactSelect, { Props, StylesConfig } from 'react-select';
import { ThemeContext } from 'styled-components';

const IndicatorSeparator: FC = () => null;

function Select<T>(props: Props<T>) {
	const { colors, fonts } = useContext(ThemeContext);

	const computedStyles = useMemo(() => {
		const styles: StylesConfig = {
			container: (provided, state) => ({
				...provided,
				opacity: state.isDisabled ? 0.4 : 1,
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
				fontFamily: fonts.regular,
				color: colors.fontPrimary,
				cursor: 'pointer',
				boxShadow: 'none',
				border: `1px solid ${colors.accentL2}`,
				borderRadius: '1px',
				outline: 'none',
				height: '42px',
				'&:hover': {
					border: `1px solid ${colors.accentL2}`,
				},
				fontSize: '14px',
				backgroundColor: colors.surfaceL3,
			}),
			menu: (provided) => ({
				...provided,
				backgroundColor: colors.surfaceL3,
				border: `1px solid ${colors.accentL2}`,
				borderRadius: '2px',
				boxShadow: '0px 4px 11px rgba(188, 99, 255, 0.15442)',
				padding: '10px',
			}),
			menuList: (provided) => ({
				...provided,
				borderRadius: 0,
				paddingBottom: 0,
				paddingTop: 0,
				textAlign: 'left',
			}),
			option: (provided) => ({
				...provided,
				color: colors.fontPrimary,
				cursor: 'pointer',
				fontSize: '14px',
				backgroundColor: colors.surfaceL3,
				'&:hover': {
					backgroundColor: colors.accentL2,
				},
			}),
			placeholder: (provided) => ({
				...provided,
				fontSize: '14px',
				opacity: 0.5,
				color: colors.fontTertiary,
			}),
		};
		return styles;
	}, [colors, fonts]);

	return (
		<ReactSelect
			styles={computedStyles}
			classNamePrefix="react-select"
			components={{ IndicatorSeparator }}
			{...props}
		/>
	);
}

export default Select;
