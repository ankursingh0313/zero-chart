import { scaleLinear, scaleTime } from 'd3-scale';
import type { CandleData, ChartDimensions } from '../types';

export const createScales = (
  data: CandleData[],
  dimensions: ChartDimensions,
  padding = { top: 20, right: 50, bottom: 30, left: 0 }
) => {
  const { width, height } = dimensions;

  // X Scale (Time)
  // We map index to x-coordinate to avoid gaps on weekends if we were using time scale directly
  // But for simplicity in this version, we'll use time scale first, or linear index scale if needed.
  // Let's use time scale for now as it's more standard for "live" data with gaps handling being a separate concern.
  // Actually, financial charts usually use index-based scales to remove gaps.
  // Let's stick to time scale for the MVP to handle dynamic time updates easily.
  
  const minTime = Math.min(...data.map(d => d.timestamp));
  const maxTime = Math.max(...data.map(d => d.timestamp));

  const xScale = scaleTime()
    .domain([minTime, maxTime])
    .range([padding.left, width - padding.right]);

  // Y Scale (Price)
  const minPrice = Math.min(...data.map(d => d.low));
  const maxPrice = Math.max(...data.map(d => d.high));
  
  // Add some padding to price range
  const priceRange = maxPrice - minPrice;
  const yPadding = priceRange * 0.1;

  const yScale = scaleLinear()
    .domain([minPrice - yPadding, maxPrice + yPadding])
    .range([height - padding.bottom, padding.top]);

  return { xScale, yScale };
};
