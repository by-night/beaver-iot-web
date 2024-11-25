import React, { useEffect, useMemo, useRef } from 'react';
import { merge } from 'lodash-es';
import Chart, { ChartConfiguration } from 'chart.js/auto'; // 引入 Chart.js
import { getChartColor } from '@/plugin/utils';

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
export default React.memo(({ chartDatasets, chartLabels, chartOptions }: IProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

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

    useEffect(() => {
        try {
            let chart: Chart<'line', (string | number | null)[], string> | null = null;
            if (chartRef.current) {
                chart = new Chart(chartRef.current, customChartOptions);
            }

            return () => {
                /**
                 * 清空图表数据
                 */
                chart?.destroy();
            };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }, [chartRef, customChartOptions]);

    return <canvas ref={chartRef} />;
});
