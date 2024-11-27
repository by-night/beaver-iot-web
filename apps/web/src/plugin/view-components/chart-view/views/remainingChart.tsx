import React, { useMemo } from 'react';
import * as Icons from '@milesight/shared/src/components/icons';
import RemainChart from '../components/basic-icon-remaining-chart';

interface IProps {
    chartDatasets: AdapterResult[];
    config: Record<string, any>;
    configJson: CustomComponentProps;
}
export default React.memo(({ chartDatasets, config, configJson }: IProps) => {
    const { isPreview } = configJson || {};
    const { icon: iconType, iconColor } = config || {};

    const chartRange = useMemo(() => {
        const { entity, data } = chartDatasets?.[0] || {};
        const { rawData } = entity || {};
        const { entityValueAttribute } = rawData || {};
        const { min, max } = entityValueAttribute || {};
        const { value } = data?.[0] || {};

        return {
            currentValue: value,
            minValue: min,
            maxValue: max,
        };
    }, [chartDatasets]);

    // 百分比
    const percent = useMemo(() => {
        const { minValue: min, maxValue: max, currentValue: value } = chartRange || {};
        if (!value) return 0;

        const range = (max || 0) - (min || 0);
        if (range === 0 || value === max) return 100;
        if (!range || value === min) return 0;

        const percent = Math.floor((value / range) * 100);
        return Math.min(100, Math.max(0, percent));
    }, [chartRange]);

    const { Icon, IconColor } = useMemo(() => {
        const Icon = iconType && Icons[iconType as keyof typeof Icons];

        return {
            Icon,
            IconColor: iconColor,
        };
    }, [iconColor, iconType]);

    return (
        <div className={`${isPreview ? 'ms-icon-remaining-preview' : ''}`}>
            <div className="ms-icon-remaining__percent">{percent}%</div>
            <div className="ms-icon-remaining__content">
                <RemainChart Icon={Icon} iconColor={IconColor} percent={100 - percent} />
            </div>
        </div>
    );
});
