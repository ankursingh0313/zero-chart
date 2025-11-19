# Zero Chart

A high-performance React Candlestick Library using HTML5 Canvas.

## Features

- **High Performance**: Uses HTML5 Canvas for rendering.
- **Interactive**: Zoom, Pan, Crosshair.
- **Multiple Chart Types**: Candlestick, Line, Bar.
- **Live Data**: Real-time updates.

## Installation

```bash
npm install zero-chart
```

## Usage

```tsx
import { ChartCanvas } from 'zero-chart';
import 'zero-chart/dist/style.css'; // If you have styles

function App() {
  const data = [/* ... */];
  
  return (
    <div style={{ height: '500px' }}>
      <ChartCanvas data={data} />
    </div>
  );
}
```
