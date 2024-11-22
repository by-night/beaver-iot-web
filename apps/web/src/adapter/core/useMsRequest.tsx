import { useRequest } from 'ahooks';
import models from '../models';
import type { Adapter, InjectStore, PluginProps } from '../types';

export const useMsRequest = ({
    adapter,
    viewProps,
    store,
}: {
    adapter: Adapter;
    viewProps: PluginProps;
    store: InjectStore;
}) => {
    const { model: modelType } = adapter || {};
    const { effect, reducer } = models[modelType as keyof typeof models] || {};
    const { refreshDeps, searchParams } = store || {};

    const request = async () => {
        if (!modelType) return;

        if (!effect) return;
        const data = await effect(searchParams);

        if (!reducer) return;
        return reducer(data, viewProps);
    };
    return useRequest(request, { refreshDeps });
};
