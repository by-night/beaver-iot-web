import React, { useEffect, useMemo, useRef } from 'react';
import { cloneDeep } from 'lodash-es';
import { Chart } from 'chart.js';

/** 动态执行脚本生成数据 */
function executeScriptsInObject(obj: Record<string, any>, injectData: any) {
    const executeScript = (script: string) => {
        // eslint-disable-next-line no-new-func
        const func = new Function('store', script);
        return func(injectData);
    };

    const traverse = (currentObj: Record<string, any>) => {
        if (typeof currentObj !== 'object' || currentObj === null) {
            return currentObj;
        }

        // 递归遍历对象的所有属性
        for (const key in currentObj) {
            if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
                if (key === '$exec' && typeof currentObj[key] === 'string') {
                    // 执行脚本并替换当前属性
                    currentObj = executeScript(currentObj[key]);
                } else {
                    currentObj[key] = traverse(currentObj[key]);
                }
            }
        }

        return currentObj;
    };

    return traverse(obj);
}
interface IProps {
    injectData: any;
    tagProps: ViewProps;
    children: React.ReactElement;
}
export default React.memo(({ injectData, tagProps, children, ...rest }: IProps) => {
    const chartRef = useRef<HTMLCanvasElement>(null);

    const chartConfiguration = useMemo(() => {
        const { chartOptions } = tagProps || {};

        return executeScriptsInObject(cloneDeep(chartOptions), injectData) as Chart['config'];
    }, [injectData, tagProps]);

    useEffect(() => {
        // 生成图表
        try {
            const ref = chartRef.current;
            const chart: Chart | null = ref ? new Chart(ref, chartConfiguration) : null;

            return () => {
                /**
                 * 清空图表数据
                 */
                chart?.destroy();
            };
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }, [chartConfiguration, chartRef]);

    return (
        <canvas ref={chartRef} {...rest}>
            {children}
        </canvas>
    );
});
