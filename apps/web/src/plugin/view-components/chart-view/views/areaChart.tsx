import React, { useMemo } from 'react';
import { merge } from 'lodash-es';
import { ChartConfiguration } from 'chart.js/auto'; // 引入 Chart.js
import { getChartColor } from '@/plugin/utils';
import BasicChart from '../components/basicChart';

type AreaChartOpts = ChartConfiguration<'line', (string | number | null)[], string>;
interface ChartDatasetsProps {
    entityLabel: string;
    entityValues: (string | number | null)[];
}
interface IProps {
    chartDatasets: ChartDatasetsProps[];
    chartLabels: string[];
    chartOptions?: AreaChartOpts;
}
export default React.memo(({ chartDatasets = [], chartLabels = [], chartOptions }: IProps) => {
    const customChartOptions = useMemo(() => {
        const chartColors = getChartColor(chartDatasets || []);

        const defaultOptions: AreaChartOpts = {
            type: 'line',
            data: {
                labels: chartLabels || [],
                datasets: (chartDatasets || []).map((chart, index) => ({
                    label: chart.entityLabel,
                    data: chart.entityValues,
                    borderWidth: 1,
                    fill: true,
                    spanGaps: true,
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
    }, [chartLabels, chartDatasets, chartOptions]);

    return <BasicChart chartOptions={customChartOptions as ChartConfiguration} />;
});
