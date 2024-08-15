import { useEffect } from 'react';
import {
    useSyncState,
    useEventEffect,
    type ComponentEvent,
    type ReactiumSyncState,
} from '@atomic-reactor/reactium-sdk-core';
import {
    useLazyQuery,
    type OperationVariables,
    type DocumentNode,
    type TypedDocumentNode,
    type LazyQueryHookOptions,
    type QueryResult,
    type NoInfer,
} from '@apollo/client';

/**
 * @description useSyncGQLQuery is a hook that wraps the useLazyQuery hook from Apollo Client, and adds state management and event handling.
 * @param {DocumentNode | TypedDocumentNode<TData, TVariables>} query The GraphQL query document.
 * @param {LazyQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>} options Options to be passed to the useLazyQuery hook.
 * @param {'set' | 'change' | 'loaded' | 'refreshed' | string} [updateEvent='set'] The event name that triggers a rerender
 * @return {ReactiumSyncState<QueryResult<TData,TVariables>>} The sync state object.
 * @see {@link [useLazyQuery](https://www.apollographql.com/docs/react/api/react/hooks/#uselazyquery)} for more information on the useLazyQuery hook from which this hook is derived.
 * @see {@link [ReactiumSyncState](https://reactiumcore.github.io/reactium-sdk-core/classes/ReactiumSyncState.html)} to understand the underlying synchronized state object.
 */
export const useSyncGQLQuery = <
    TData = any,
    TVariables extends OperationVariables = OperationVariables,
>(
    query: DocumentNode | TypedDocumentNode<TData, TVariables>,
    options?: LazyQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>,
    updateEvent: 'set' | 'change' | 'loaded' | 'refreshed' | string = 'set',
): ReactiumSyncState<QueryResult<TData, TVariables>> => {
    const [lazy, result] = useLazyQuery(query, options);
    const state = useSyncState<typeof result>(result, updateEvent);

    state.extend(
        'refresh',
        async (variables?: Partial<TVariables>): Promise<void> => {
            const vars = variables || options?.variables;
            state.dispatch('refresh');
            const newResponse = await result.refetch(vars);
            state.set(newResponse, undefined);
            state.dispatch<typeof newResponse>('refreshed', newResponse);
        },
    );

    useEventEffect(state, {
        load: async (e): Promise<void> => {
            const { detail } = e as ComponentEvent<typeof options>;
            state.set('loading', true);
            const result = await lazy(detail);
            state.set(result, undefined);
            state.dispatch('loaded', result);
        },

        refreshed: (e): void => {
            const { detail } = e as ComponentEvent<typeof result>;
            state.set(detail, undefined);
        },
    });

    useEffect((): void => {
        if (result.called) return;
        state.dispatch('load', options);
    }, []);

    return state;
};
