import effect from '../effects/getHistory';
import reducer from '../reducers/multiple';
import type { Model } from '../types';

const model: Model<typeof effect, typeof reducer> = {
    effect,
    reducer,
};
export default model;
