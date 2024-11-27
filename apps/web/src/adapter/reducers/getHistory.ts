import { useTime } from '@milesight/shared/src/hooks';
import type { PluginProps } from '../types';

export const useReducer = () => {
    const { getTimeFormat } = useTime();

    const run = (
        result: (SearchResponseType<EntityHistoryData[]> | void)[],
        viewProps: PluginProps,
    ) => {
        const { config } = viewProps;
        const { entity } = config || {};

        const historyData = (result || []).map(d => d?.content || []);
        const entityList = Array.isArray(entity) ? entity : [entity].filter(Boolean);

        /**
         * 去重处理，获取所有值的时间段
         */
        const newChartLabels = historyData
            .reduce((a: number[], c) => {
                const times = (c || [])?.map(h => h.timestamp)?.filter(Boolean) || [];

                return [...new Set([...a, ...times])];
            }, [])
            .sort((a, b) => Number(a) - Number(b));

        const newChartDatasets: AdapterResult<EntityHistoryData['value']>[] = [];

        (historyData || []).forEach((h, index) => {
            /**
             * 根据时间戳判断当前实体在该时间段是否有数据
             */
            const chartData = newChartLabels.map(l => {
                const valueIndex = h.findIndex(item => item.timestamp === l);

                if (valueIndex !== -1) {
                    const { value, value_type: valueType, timestamp } = h[valueIndex];

                    return {
                        key: getTimeFormat(Number(timestamp)),
                        value,
                        valueType,
                    };
                }
                return null;
            });

            newChartDatasets.push({
                entity: entityList[index],
                data: chartData || [],
            });
        });

        return {
            chartDatasets: newChartDatasets,
        };
    };

    return {
        run,
    };
};
