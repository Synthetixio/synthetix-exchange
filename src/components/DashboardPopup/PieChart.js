import React from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

const Chart = ({ data }) => {
	console.log(data);
	return <PieChart dataKey="total" data={data}></PieChart>;
};

export default Chart;
