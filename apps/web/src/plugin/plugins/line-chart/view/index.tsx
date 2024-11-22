import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // 引入 Chart.js
import { useBasicChartEntity } from '@/plugin/hooks';
import { getChartColor } from '@/plugin/utils';
import { Tooltip } from '@/plugin/view-components';
import { useConnect } from '@/adapter';
import styles from './style.module.less';

export interface ViewProps {
    config: {
        entity?: EntityOptionType[];
        title?: string;
        time: number;
    };
    // eslint-disable-next-line react/no-unused-prop-types
    configJson: CustomComponentProps;
}

const View = (props: ViewProps) => {
    const { config } = props;
    const { title } = config || {};

    /**
     * canvas ref
     */
    const chartRef = useRef<HTMLCanvasElement>(null);
    const { data } = useConnect<ViewProps['config']>({ viewProps: props }) || {};
    const { chartShowData, chartLabels } = data || {};

    useEffect(() => {
        try {
            let chart: Chart<'line', (string | number | null)[], string> | null = null;
            const resultColor = getChartColor(chartShowData);
            if (chartRef.current) {
                chart = new Chart(chartRef.current, {
                    type: 'line',
                    data: {
                        labels: chartLabels,
                        datasets: chartShowData.map((chart: any, index: number) => ({
                            label: chart.entityLabel,
                            data: chart.entityValues,
                            borderWidth: 1,
                            spanGaps: true,
                            backgroundColor: resultColor[index],
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
                });
            }

            return () => {
                /**
                 * 清空图表数据
                 */
                chart?.destroy();
            };
        } catch (error) {
            console.error(error);
        }
    }, [chartLabels, chartShowData, chartRef]);

    return (
        <div className={styles['line-chart-wrapper']}>
            <Tooltip className={styles.name} autoEllipsis title={title} />
            <div className={styles['line-chart-content']}>
                <canvas ref={chartRef} />
            </div>
        </div>
    );
};

export default React.memo(View);
