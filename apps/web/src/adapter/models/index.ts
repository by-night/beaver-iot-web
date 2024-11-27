import { useModel as useHistoryModel } from './getHistory';
import { useModel as useAggregateModel } from './getAggregateHistory';
import { useModel as useEntityStatusModel } from './getEntityStatus';

export default {
    getHistory: useHistoryModel,
    getAggregateHistory: useAggregateModel,
    getEntityStatus: useEntityStatusModel,
};
