import React, { useEffect, useRef, useState, useMemo } from 'react';
import { defaultTheme } from '../types';
import type { CandleData, ChartTheme, ChartType } from '../types';
import { createScales } from '../utils/scales';
import { drawCandle } from '../utils/drawCandle';
import { drawLine } from '../utils/drawLine';
import { drawBar } from '../utils/drawBar';
import { useChartDimensions } from '../hooks/useChartDimensions';

interface ChartCanvasProps {
    data: CandleData[];
    theme?: ChartTheme;
    chartType?: ChartType;
}

export const ChartCanvas: React.FC<ChartCanvasProps> = ({
    data,
    theme = defaultTheme,
    chartType = 'candle'
}) => {
    const { ref, dimensions } = useChartDimensions();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // State for visible range (indices)
    const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [crosshair, setCrosshair] = useState<{ x: number, y: number, data: CandleData } | null>(null);
    const lastMouseX = useRef<number>(0);

    // Initialize range when data loads
    useEffect(() => {
        if (data.length > 0) {
            const count = Math.min(data.length, 50);
            setVisibleRange({ start: data.length - count, end: data.length });
        }
    }, [data.length]);

    // Memoize scales
    const { xScale, yScale, visibleData } = useMemo(() => {
        if (dimensions.width === 0 || dimensions.height === 0 || data.length === 0) {
            return { xScale: null, yScale: null, visibleData: [] };
        }
        const visibleData = data.slice(visibleRange.start, visibleRange.end);
        if (visibleData.length === 0) return { xScale: null, yScale: null, visibleData: [] };

        const { xScale, yScale } = createScales(visibleData, dimensions);
        return { xScale, yScale, visibleData };
    }, [data, visibleRange, dimensions]);

    // Handle Zoom (Wheel)
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const { start, end } = visibleRange;
        const range = end - start;
        const zoomFactor = 0.1;
        const delta = Math.sign(e.deltaY) * Math.max(Math.floor(range * zoomFactor), 1);

        let newStart = start - delta;
        let newEnd = end + delta;

        if (newEnd - newStart < 5) return;

        newStart = Math.max(0, newStart);
        newEnd = Math.min(data.length, newEnd);

        setVisibleRange({ start: newStart, end: newEnd });
    };

    // Handle Mouse Events
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        lastMouseX.current = e.clientX;
        setCrosshair(null); // Hide crosshair while dragging
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (isDragging) {
            const dx = e.clientX - lastMouseX.current;
            lastMouseX.current = e.clientX;

            const visibleDataCount = visibleRange.end - visibleRange.start;
            const pixelsPerCandle = dimensions.width / visibleDataCount;
            const candlesMoved = Math.round(-dx / pixelsPerCandle);

            if (candlesMoved === 0) return;

            let { start, end } = visibleRange;
            const newStart = start + candlesMoved;
            const newEnd = end + candlesMoved;

            if (newStart < 0) {
                const diff = 0 - newStart;
                setVisibleRange({ start: 0, end: end + diff });
            } else if (newEnd > data.length) {
                const diff = newEnd - data.length;
                setVisibleRange({ start: start - diff, end: data.length });
            } else {
                setVisibleRange({ start: newStart, end: newEnd });
            }
        } else {
            // Crosshair logic
            if (!xScale || !yScale || visibleData.length === 0) return;

            const candleWidth = dimensions.width / visibleData.length;
            const index = Math.floor(mouseX / candleWidth);

            if (index >= 0 && index < visibleData.length) {
                const d = visibleData[index];
                setCrosshair({
                    x: xScale(d.timestamp), // Snap to candle center
                    y: mouseY,
                    data: d
                });
            } else {
                setCrosshair(null);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        setCrosshair(null);
    };

    // Draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = dimensions.width * dpr;
        canvas.height = dimensions.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${dimensions.width}px`;
        canvas.style.height = `${dimensions.height}px`;

        // Clear
        ctx.fillStyle = theme.background;
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);

        if (!xScale || !yScale || visibleData.length === 0) return;

        // Draw Chart
        if (chartType === 'line') {
            drawLine(ctx, visibleData, xScale, yScale, theme);
        } else {
            const xRange = dimensions.width - 50;
            const candleWidth = Math.max((xRange / visibleData.length) * 0.8, 1);

            visibleData.forEach(d => {
                const x = xScale(d.timestamp);
                const yOpen = yScale(d.open);
                const yClose = yScale(d.close);
                const yHigh = yScale(d.high);
                const yLow = yScale(d.low);

                if (chartType === 'bar') {
                    drawBar(ctx, d, x, yOpen, yClose, yHigh, yLow, candleWidth, theme);
                } else {
                    drawCandle(ctx, d, x, yOpen, yClose, yHigh, yLow, candleWidth, theme);
                }
            });
        }

        // Draw Crosshair
        if (crosshair) {
            ctx.strokeStyle = theme.textColor;
            ctx.lineWidth = 0.5;
            ctx.setLineDash([5, 5]);

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(crosshair.x, 0);
            ctx.lineTo(crosshair.x, dimensions.height);
            ctx.stroke();

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(0, crosshair.y);
            ctx.lineTo(dimensions.width, crosshair.y);
            ctx.stroke();

            ctx.setLineDash([]);

            // Tooltip
            const text = `O: ${crosshair.data.open.toFixed(2)} H: ${crosshair.data.high.toFixed(2)} L: ${crosshair.data.low.toFixed(2)} C: ${crosshair.data.close.toFixed(2)}`;
            ctx.font = '12px sans-serif';
            const textWidth = ctx.measureText(text).width;

            ctx.fillStyle = theme.gridColor;
            ctx.fillRect(5, 5, textWidth + 10, 20);

            ctx.fillStyle = theme.textColor;
            ctx.fillText(text, 10, 20);
        }

    }, [visibleData, xScale, yScale, dimensions, theme, crosshair, chartType]);

    return (
        <div
            ref={ref}
            style={{ width: '100%', height: '100%', minHeight: '400px', cursor: isDragging ? 'grabbing' : 'crosshair' }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};
