import { awaitWrap, entityAPI, getResponseData, isRequestSuccess } from '@/services/http';
import type { InjectStore } from '@/adapter/types';

const request = async (entity: EntityOptionType, time: number) => {
    const now = Date.now();
    const { value } = entity || {};

    const [error, resp] = await awaitWrap(
        entityAPI.getHistory({
            entity_id: value,
            start_timestamp: now - time,
            end_timestamp: now,
            page_number: 1,
            page_size: 999,
        }),
    );
    if (error || !isRequestSuccess(resp)) return;

    return getResponseData(resp);
};

export default (searchParams: InjectStore['searchParams']) => {
    const { entity, time } = searchParams || {};
    const entityList = Array.isArray(entity) ? entity : [entity];

    return Promise.all(entityList.map(entity => request(entity, time)));
};
