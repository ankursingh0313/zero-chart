import { useState, useEffect } from 'react';
import { ChartCanvas } from './components/ChartCanvas';
import { generateData } from './utils/mockData';
import type { CandleData, ChartType } from './types';
import './App.css';

function App() {
  const [data, setData] = useState<CandleData[]>([]);
  const [chartType, setChartType] = useState<ChartType>('candle');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setData(generateData(100));
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const nextTime = last.timestamp + 24 * 60 * 60 * 1000;
        const volatility = 2;
        const change = (Math.random() - 0.5) * volatility;
        const open = last.close;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;

        const newCandle: CandleData = {
          timestamp: nextTime,
          open,
          high,
          low,
          close
        };
        return [...prev, newCandle];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', background: '#161a25' }}>
      <header style={{ padding: '1rem', color: 'white', borderBottom: '1px solid #2a2e39', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Zero Chart</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsLive(!isLive)}
            style={{
              padding: '5px 10px',
              background: isLive ? '#ef5350' : '#26a69a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {isLive ? 'Stop Live' : 'Start Live'}
          </button>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as ChartType)}
            style={{ padding: '5px', background: '#2a2e39', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            <option value="candle">Candlestick</option>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
          </select>
        </div>
      </header>
      <main style={{ flex: 1, padding: '20px' }}>
        <div style={{ width: '100%', height: '600px', border: '1px solid #2a2e39' }}>
          <ChartCanvas data={data} chartType={chartType} />
        </div>
      </main>
    </div>
  );
}

export default App;
