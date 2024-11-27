import React, { useMemo } from 'react';
import { merge } from 'lodash-es';
import { ChartConfiguration } from 'chart.js/auto'; // 引入 Chart.js
import { getChartColor } from '@/plugin/utils';
import BasicChart from '../components/basicChart';

type BarChartOpts = ChartConfiguration<'bar', (string | number | null)[], string>;
interface IProps {
    chartDatasets: AdapterResult[];
    chartOptions?: BarChartOpts;
}
export default React.memo(({ chartDatasets = [], chartOptions }: IProps) => {
    const customChartOptions = useMemo(() => {
        const chartColors = getChartColor(chartDatasets || []);

        const defaultOptions: BarChartOpts = {
            type: 'bar',
            data: {
                labels: chartDatasets?.[0]?.data.map(item => item?.key),
                datasets: (chartDatasets || []).map((chart, index) => ({
                    label: chart?.entity?.label,
                    data: (chart?.data || []).map(item => item?.value),
                    borderWidth: 1,
                    backgroundColor: chartColors[index],
                })),
            },
            options: {
                responsive: true, // 使图表响应式
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        };
        return merge(defaultOptions, chartOptions);
    }, [chartDatasets, chartOptions]);

    return <BasicChart chartOptions={customChartOptions as ChartConfiguration} />;
});
