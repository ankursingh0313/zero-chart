import type { ScaleLinear, ScaleTime } from 'd3-scale';
import type { ChartTheme } from '../types';
import { format } from 'date-fns';

export const drawXAxis = (
  ctx: CanvasRenderingContext2D,
  xScale: ScaleTime<number, number>,
  width: number,
  height: number,
  theme: ChartTheme
) => {
  const ticks = xScale.ticks(5);
  const bottomY = height - 30; // Assuming 30px bottom padding

  const domain = xScale.domain();
  const start = domain[0];
  const end = domain[1];
  const diff = end.getTime() - start.getTime();

  // Determine format based on range
  let timeFormat = 'HH:mm';
  if (diff > 31536000000) { // > 1 year
    timeFormat = 'yyyy';
  } else if (diff > 2592000000) { // > 1 month
    timeFormat = 'MMM yyyy';
  } else if (diff > 86400000) { // > 1 day
    timeFormat = 'MMM dd';
  } else if (diff < 60000) { // < 1 minute
    timeFormat = 'HH:mm:ss';
  }

  ctx.strokeStyle = theme.gridColor;
  ctx.fillStyle = theme.textColor;
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // Draw axis line
  ctx.beginPath();
  ctx.moveTo(0, bottomY);
  ctx.lineTo(width, bottomY);
  ctx.stroke();

  ticks.forEach(tick => {
    const x = xScale(tick);
    if (x < 0 || x > width) return;

    // Draw tick line
    ctx.beginPath();
    ctx.moveTo(x, bottomY);
    ctx.lineTo(x, bottomY + 5);
    ctx.stroke();

    // Draw label
    const label = format(tick, timeFormat);
    ctx.fillText(label, x, bottomY + 8);
  });
};

export const drawYAxis = (
  ctx: CanvasRenderingContext2D,
  yScale: ScaleLinear<number, number>,
  width: number,
  height: number,
  theme: ChartTheme
) => {
  const ticks = yScale.ticks(5);
  const rightX = width - 50; // Assuming 50px right padding

  ctx.strokeStyle = theme.gridColor;
  ctx.fillStyle = theme.textColor;
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';

  // Draw axis line
  ctx.beginPath();
  ctx.moveTo(rightX, 0);
  ctx.lineTo(rightX, height);
  ctx.stroke();

  ticks.forEach(tick => {
    const y = yScale(tick);
    if (y < 0 || y > height) return;

    // Draw tick line
    ctx.beginPath();
    ctx.moveTo(rightX, y);
    ctx.lineTo(rightX + 5, y);
    ctx.stroke();

    // Draw label
    ctx.fillText(tick.toFixed(2), rightX + 8, y);
  });
};
