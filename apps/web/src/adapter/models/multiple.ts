import { useFetch } from '../effects/getHistory';
import { useReducer } from '../reducers/multiple';
import type { Model } from '../types';

const model: Model<typeof useFetch, typeof useReducer> = {
    useFetch,
    useReducer,
};
export default model;
