import type { CandleData, ChartTheme } from '../types';

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  data: CandleData[],
  xScale: any,
  yScale: any,
  theme: ChartTheme
) => {
  ctx.strokeStyle = theme.upColor;
  ctx.lineWidth = 2;
  ctx.beginPath();

  data.forEach((d, i) => {
    const x = xScale(d.timestamp);
    const y = yScale(d.close);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
};
