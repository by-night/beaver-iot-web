import { EntityAPISchema } from '@/services/http';
import type { PluginProps } from '../types';

type AggregateHistoryResult = EntityAPISchema['getAggregateHistory']['response'];
export const useReducer = () => {
    const run = (
        aggregateHistoryData: (AggregateHistoryResult | void)[],
        viewProps: PluginProps,
    ) => {
        const { config } = viewProps;
        const { entity } = config || {};

        const entityList = Array.isArray(entity) ? entity : [entity].filter(Boolean);

        const newChartDatasets: AdapterResult[] = aggregateHistoryData.map((historyData, index) => {
            const { value, value_type: valueType, count_result: countResult } = historyData || {};

            if (countResult) {
                return {
                    entity: entityList[index],
                    data: (countResult || []).map(item => {
                        return {
                            value: item.value,
                            valueType: item.value_type,
                            key: item.count,
                        };
                    }),
                };
            }

            return {
                entity: entityList[index],
                data: [
                    {
                        value,
                        valueType: valueType || null,
                        key: '',
                    },
                ],
            };
        });

        return {
            chartDatasets: newChartDatasets,
        };
    };

    return {
        run,
    };
};
