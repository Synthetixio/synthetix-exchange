import React from 'react';
import Slider, { Handle, createSliderWithTooltip } from 'rc-slider';
import Tooltip from 'rc-tooltip';

import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import './Slider.css';

const CustomSlider = createSliderWithTooltip(Slider);

export const handle = (props) => {
	const { value, dragging, index, ...restProps } = props;
	return (
		<Tooltip
			prefixCls="rc-slider-tooltip"
			overlay={value}
			visible={dragging}
			placement="top"
			key={index}
		>
			<Handle value={value} {...restProps} />
		</Tooltip>
	);
};

const SliderComponent = ({ min, max, value, tooltipRenderer, onChange }) => {
	return (
		<CustomSlider
			min={min}
			max={max}
			step={0.1}
			value={value}
			handle={handle}
			tipFormatter={tooltipRenderer}
			onChange={onChange}
		/>
	);
};

export default SliderComponent;
