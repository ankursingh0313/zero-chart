import type { CandleData, ChartTheme } from '../types';

export const drawBar = (
  ctx: CanvasRenderingContext2D,
  candle: CandleData,
  x: number,
  yOpen: number,
  yClose: number,
  yHigh: number,
  yLow: number,
  candleWidth: number,
  theme: ChartTheme
) => {
  const isUp = candle.close >= candle.open;
  const color = isUp ? theme.upColor : theme.downColor;

  ctx.strokeStyle = color;
  ctx.lineWidth = 1;

  // Draw vertical line (High to Low)
  ctx.beginPath();
  ctx.moveTo(x, yHigh);
  ctx.lineTo(x, yLow);
  ctx.stroke();

  // Draw open tick (left)
  ctx.beginPath();
  ctx.moveTo(x, yOpen);
  ctx.lineTo(x - candleWidth / 2, yOpen);
  ctx.stroke();

  // Draw close tick (right)
  ctx.beginPath();
  ctx.moveTo(x, yClose);
  ctx.lineTo(x + candleWidth / 2, yClose);
  ctx.stroke();
};
