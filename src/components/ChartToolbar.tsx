import React from 'react';

export const intervals = [
    { label: '1s', value: 1000 },
    { label: '1m', value: 60 * 1000 },
    { label: '5m', value: 5 * 60 * 1000 },
    { label: '15m', value: 15 * 60 * 1000 },
    { label: '1h', value: 60 * 60 * 1000 },
    { label: '12h', value: 12 * 60 * 60 * 1000 },
    { label: '1D', value: 24 * 60 * 60 * 1000 },
    { label: '1W', value: 7 * 24 * 60 * 60 * 1000 },
    { label: '1M', value: 30 * 24 * 60 * 60 * 1000 },
];

interface ChartToolbarProps {
    selectedInterval: number;
    onIntervalChange: (interval: number) => void;
}

export const ChartToolbar: React.FC<ChartToolbarProps> = ({
    selectedInterval,
    onIntervalChange,
}) => {
    return (
        <div style={{ display: 'flex', gap: '5px' }}>
            {intervals.map((interval) => (
                <button
                    key={interval.label}
                    onClick={() => onIntervalChange(interval.value)}
                    style={{
                        padding: '5px 10px',
                        background: selectedInterval === interval.value ? '#26a69a' : '#2a2e39',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                    }}
                >
                    {interval.label}
                </button>
            ))}
        </div>
    );
};
