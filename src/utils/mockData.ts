import type { CandleData } from '../types';

export const generateData = (count: number = 100): CandleData[] => {
  const data: CandleData[] = [];
  let time = new Date('2023-01-01').getTime();
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

    time += 24 * 60 * 60 * 1000; // 1 day
    price = close;
  }

  return data;
};
