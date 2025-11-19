export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ChartDimensions {
  width: number;
  height: number;
}

export interface ChartTheme {
  background: string;
  upColor: string;
  downColor: string;
  wickColor: string;
  gridColor: string;
  textColor: string;
}

export const defaultTheme: ChartTheme = {
  background: '#161a25',
  upColor: '#26a69a',
  downColor: '#ef5350',
  wickColor: '#787b86',
  gridColor: '#2a2e39',
  textColor: '#d1d4dc',
};

export type ChartType = 'candle' | 'line' | 'bar';
