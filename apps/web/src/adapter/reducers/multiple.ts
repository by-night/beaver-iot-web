import type { PluginProps } from '../types';

export interface ChartShowDataProps {
    entityLabel: string;
    entityValues: (string | number | null)[];
}
export default (
    result: (SearchResponseType<EntityHistoryData[]> | void)[],
    viewProps: PluginProps,
) => {
    const { config } = viewProps;
    const { entity } = config || {};

    const historyData = (result || []).map(d => d?.content || []);

    /**
     * 去重处理，获取所有值的时间段
     */
    const newChartLabels = historyData
        .reduce((a: number[], c) => {
            const times = (c || [])?.map(h => h.timestamp)?.filter(Boolean) || [];

            return [...new Set([...a, ...times])];
        }, [])
        .sort((a, b) => Number(a) - Number(b));

    const newChartShowData: ChartShowDataProps[] = [];

    /**
     * 实体数据转换
     */
    (historyData || []).forEach((h, index) => {
        const entityLabel = (entity || [])[index]?.label || '';

        /**
         * 根据时间戳判断当前实体在该时间段是否有数据
         */
        const chartData = newChartLabels.map(l => {
            const valueIndex = h.findIndex(item => item.timestamp === l);
            if (valueIndex !== -1) {
                return h[valueIndex].value;
            }

            return null;
        });

        if (entityLabel) {
            newChartShowData.push({
                entityLabel,
                entityValues: chartData,
            });
        }
    });

    return {
        chartLabels: newChartLabels,
        chartShowData: newChartShowData,
    };
};
