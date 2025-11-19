import type { CandleData, ChartTheme } from '../types';

export const drawCandle = (
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
  ctx.fillStyle = color;
  ctx.lineWidth = 1;

  // Draw wick
  ctx.beginPath();
  ctx.moveTo(x, yHigh);
  ctx.lineTo(x, yLow);
  ctx.stroke();

  // Draw body
  const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1); // Ensure at least 1px height
  const bodyY = Math.min(yOpen, yClose);
  
  ctx.fillRect(x - candleWidth / 2, bodyY, candleWidth, bodyHeight);
};
