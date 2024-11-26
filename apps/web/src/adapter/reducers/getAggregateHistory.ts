import type { PluginProps } from '../types';

export interface ChartShowDataProps {
    entityLabel: string;
    entityValues: (string | number | null)[];
}

export const useReducer = () => {
    const run = (
        historyData: (SearchResponseType<EntityHistoryData[]> | void)[],
        viewProps: PluginProps,
    ) => {
        const { config } = viewProps;
        const { entity } = config || {};

        const entityList = Array.isArray(entity) ? entity : [entity].filter(Boolean);
        return {
            chartLabels: (entityList || []).map(item => item?.label),
            chartDatasets: (historyData || []).map(item => item?.value),
        };
    };

    return {
        run,
    };
};
