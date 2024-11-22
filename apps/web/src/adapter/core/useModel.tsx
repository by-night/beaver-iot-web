import models from '../models';

export const useModel = ({ modelType }: { modelType: keyof typeof models }) => {
    const { useFetch, useReducer } = models[modelType] || {};

    const useDefaultFetch = () => {
        return {
            run: () => void 0,
        };
    };
    const useDefaultReducer = () => {
        return {
            run: () => void 0,
        };
    };

    return {
        useFetch: useFetch || useDefaultFetch,
        useReducer: useReducer || useDefaultReducer,
    };
};
