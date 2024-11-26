import { useModel as useHistoryModel } from './getHistory';
import { useModel as useAggregateModel } from './getAggregateHistory';

export default {
    getHistory: useHistoryModel,
    getAggregateHistory: useAggregateModel,
};
