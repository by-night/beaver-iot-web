import models from '../models';
import { useProvider } from './useProvider';
import { useMsRequest } from './useMsRequest';
import { useMsWebsocket } from './useMsWebsocket';
import type { PluginProps } from '../types';

export const useConnect = <T extends Record<string, any>>({
    viewProps,
}: {
    viewProps: PluginProps<T>;
}) => {
    const { configJson } = viewProps;
    const { adapter } = configJson || {};

    const { model: modelType } = adapter || {};
    const { searchKeys } = models[modelType as keyof typeof models] || {};

    const store = useProvider({ viewProps, adapter, searchKeys });
    const result = useMsRequest({
        adapter,
        viewProps,
        store,
    });
    useMsWebsocket({
        store,
        viewProps,
        runAsync: result?.runAsync,
    });

    return result;
};
