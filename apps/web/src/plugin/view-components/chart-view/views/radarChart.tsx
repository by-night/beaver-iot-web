import React, { useMemo } from 'react';
import { merge } from 'lodash-es';
import { ChartConfiguration } from 'chart.js/auto'; // 引入 Chart.js
import { useTheme } from '@milesight/shared/src/hooks';
import BasicChart from '../components/basicChart';

type RadarChartOpts = ChartConfiguration<'radar', (string | number | null)[], string>;
interface IProps {
    chartDatasets: (string | number | null)[];
    chartLabels: string[];
    chartOptions?: RadarChartOpts;
}
const DEFAULT_COUNT = 5;
export default React.memo(({ chartDatasets = [], chartLabels = [], chartOptions }: IProps) => {
    const { blue, white } = useTheme();

    // 填充占位图表数据
    const getFillList = <T,>(list: T[] = [], defaultValue?: any): T[] => {
        if (list && list.length >= DEFAULT_COUNT) return list;

        // 余量
        const surplus = 5 - list.length;
        const surplusList = new Array(surplus).fill(defaultValue);

        return [...list, ...surplusList];
    };
    const newChartLabels = useMemo(() => getFillList(chartLabels, ''), [chartLabels]);

    const customChartOptions = useMemo(() => {
        const defaultOptions: RadarChartOpts = {
            type: 'radar',
            data: {
                labels: newChartLabels,
                datasets: [
                    {
                        data: chartDatasets.map(chart => chart || 0),
                        fill: true,
                        backgroundColor: blue[300],
                        borderColor: blue[600],
                        pointBackgroundColor: blue[700],
                        pointBorderColor: white,
                        pointHoverBackgroundColor: white,
                        pointHoverBorderColor: blue[700],
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        filter: tooltipItem => {
                            return tooltipItem.dataIndex <= chartDatasets.length - 1; // 只显示真实的点
                        },
                        callbacks: {
                            label: context => {
                                const { raw, dataset, dataIndex } = context || {};

                                const label = dataset.label || '';

                                // 获取单位
                                const getUnit = () => {
                                    // TODO
                                    // const { entity } = chartDatasets[dataIndex] || {};
                                    // const { rawData: currentEntity } = entity || {};
                                    // if (!currentEntity) return;

                                    // // 获取当前选中实体
                                    // const { entityValueAttribute } = currentEntity || {};
                                    // const { unit } = entityValueAttribute || {};
                                    // return unit;
                                    return '';
                                };
                                const unit = getUnit();

                                // 自定义悬停时显示的文字内容
                                return `${label}${raw}${unit || ''}`;
                            },
                        },
                    },
                },
                elements: {
                    line: {
                        borderWidth: 3,
                    },
                },
            },
        };
        return merge(defaultOptions, chartOptions);
    }, [blue, chartDatasets, chartOptions, newChartLabels, white]);

    return <BasicChart chartOptions={customChartOptions as ChartConfiguration} />;
});
