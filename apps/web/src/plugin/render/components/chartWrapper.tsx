import React from 'react';
import type { PluginProps } from '@/adapter';
import ChartComponent from './chartComponent';
import { useSource } from '../hooks/useSource';

interface IProps {
    tag: string;
    viewProps: PluginProps;
    tagProps: ViewProps;
    children: React.ReactElement;
}
export default React.memo(({ tag, children, ...rest }: IProps) => {
    if (['AreaChart', 'chart'].includes(tag)) {
        return (
            <ChartBlock tag={tag} {...rest}>
                {children}
            </ChartBlock>
        );
    }

    return children;
});

export const ChartBlock = React.memo(({ tag, viewProps, tagProps, children }: IProps) => {
    const { data: injectData } = useSource({ viewProps, tagProps });

    if (['AreaChart'].includes(tag)) {
        return React.Children.map(children, child => {
            return React.cloneElement(child, {
                ...(injectData || {}),
            });
        });
    }
    return (
        <ChartComponent injectData={injectData} tagProps={tagProps}>
            {children}
        </ChartComponent>
    );
});
