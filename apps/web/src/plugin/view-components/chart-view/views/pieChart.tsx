import React, { useMemo } from 'react';
import { merge } from 'lodash-es';
import { ChartConfiguration } from 'chart.js/auto'; // 引入 Chart.js
import { getChartColor } from '@/plugin/utils';
import BasicChart from '../components/basicChart';

type PieChartOpts = ChartConfiguration<'pie', (string | number | null)[], string>;
interface IProps {
    chartDatasets: AdapterResult[];
    chartOptions?: PieChartOpts;
}
export default React.memo(({ chartDatasets = [], chartOptions }: IProps) => {
    const customChartOptions = useMemo(() => {
        const list = chartDatasets?.[0]?.data || [];
        const chartColors = getChartColor(list || []);

        const defaultOptions: PieChartOpts = {
            type: 'pie',
            data: {
                labels: list.map(item => String(item?.value || '')), // 数据标签
                datasets: [
                    {
                        data: list.map(item => item?.key),
                        borderWidth: 1, // 边框宽度
                        backgroundColor: chartColors,
                    },
                ],
            },
            options: {
                responsive: true, // 使图表响应式
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right', // 图例位置
                    },
                    tooltip: {
                        enabled: true, // 启用提示工具
                    },
                },
            },
        };
        return merge(defaultOptions, chartOptions);
    }, [chartDatasets, chartOptions]);

    return <BasicChart chartOptions={customChartOptions as ChartConfiguration} />;
});
