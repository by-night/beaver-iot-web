import { EntityAPISchema } from '@/services/http';
import type { PluginProps } from '../types';

type EntityStatusResult = EntityAPISchema['getEntityStatus']['response'];
export const useReducer = () => {
    const run = (entityStatus: (EntityStatusResult | void)[], viewProps: PluginProps) => {
        const { config } = viewProps;
        const { entity } = config || {};

        const entityList = Array.isArray(entity) ? entity : [entity].filter(Boolean);

        const newChartDatasets = (entityStatus || []).map((item, index) => {
            return {
                entity: entityList[index],
                data: [
                    {
                        value: item?.value,
                        valueType: item?.value_type,
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
