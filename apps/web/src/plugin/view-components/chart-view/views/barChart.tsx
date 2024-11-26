import React, { useMemo } from 'react';
import { merge } from 'lodash-es';
import { ChartConfiguration } from 'chart.js/auto'; // 引入 Chart.js
import { getChartColor } from '@/plugin/utils';
import BasicChart from '../components/basicChart';

type BarChartOpts = ChartConfiguration<'bar', (string | number | null)[], string>;
interface ChartDatasetsProps {
    entityLabel: string;
    entityValues: (string | number | null)[];
}
interface IProps {
    chartDatasets: ChartDatasetsProps[];
    chartLabels: string[];
    chartOptions?: BarChartOpts;
}
export default React.memo(({ chartDatasets = [], chartLabels = [], chartOptions }: IProps) => {
    const customChartOptions = useMemo(() => {
        const chartColors = getChartColor(chartDatasets || []);

        const defaultOptions: BarChartOpts = {
            type: 'bar',
            data: {
                labels: chartLabels,
                datasets: (chartDatasets || []).map((chart: any, index: number) => ({
                    label: chart.entityLabel,
                    data: chart.entityValues,
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
    }, [chartDatasets, chartLabels, chartOptions]);

    return <BasicChart chartOptions={customChartOptions as ChartConfiguration} />;
});
