import type { CandleData } from '../types';

export const generateData = (count: number = 100, interval: number = 24 * 60 * 60 * 1000): CandleData[] => {
  const data: CandleData[] = [];
  const now = Date.now();
  // Align time to the nearest interval to make it look cleaner
  let time = now - (count * interval);
  time = Math.floor(time / interval) * interval;
  
  let price = 100;

  for (let i = 0; i < count; i++) {
    const open = price;
    const volatility = 2;
    const change = (Math.random() - 0.5) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;

    data.push({
      timestamp: time,
      open,
      high,
      low,
      close,
    });

    time += interval;
    price = close;
  }

  return data;
};
