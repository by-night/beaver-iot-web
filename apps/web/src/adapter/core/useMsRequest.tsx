import { useRequest } from 'ahooks';
import type { Adapter, InjectStore, PluginProps } from '../types';
import { useModel } from './useModel';

export const useMsRequest = ({
    adapter,
    viewProps,
    store,
}: {
    adapter: Adapter;
    viewProps: PluginProps;
    store: InjectStore;
}) => {
    const { refreshDeps, searchParams } = store || {};
    const { model: modelType } = adapter || {};
    const { useFetch, useReducer } = useModel({ modelType });

    const { run: effect } = useFetch();
    const { run: reducer } = useReducer();

    const request = async () => {
        if (!modelType) return;

        if (!effect) return;
        const data = await effect(searchParams);

        if (!reducer) return;
        return reducer(data, viewProps);
    };
    return useRequest(request, { refreshDeps });
};
