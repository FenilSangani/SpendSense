// LineChart.jsx — Reusable Line Chart Component
// Uses Recharts library to display daily spending trends

import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * LineChartComponent
 * @param {Array} data - Array like [{ date: 'Jan 1', amount: 500 }, ...]
 * @param {string} dataKey - The key in data objects to plot (default: 'amount')
 * @param {string} color - Line color (default: orange accent)
 * @param {number} height - Chart height in pixels (default: 300)
 */
const LineChartComponent = ({ data = [], dataKey = 'amount', color = '#ff6a00', height = 300 }) => {
  // Don't render if there's no data
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No data available</p>
      </div>
    );
  }

  // Custom tooltip shown on hover
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: '#161616',
            border: '1px solid #262626',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ffffff',
            fontSize: '0.85rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
        >
          <p style={{ fontWeight: 600 }}>{label}</p>
          <p style={{ color: '#a3a3a3' }}>
            ₹{payload[0].value.toLocaleString('en-IN')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLine data={data}>
        {/* Subtle grid */}
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />

        {/* X axis — dates */}
        <XAxis
          dataKey="date"
          tick={{ fill: '#6e6e6e', fontSize: 12 }}
          axisLine={{ stroke: '#262626' }}
          tickLine={false}
        />

        {/* Y axis — amounts */}
        <YAxis
          tick={{ fill: '#6e6e6e', fontSize: 12 }}
          axisLine={{ stroke: '#262626' }}
          tickLine={false}
          tickFormatter={(value) => `₹${value}`}
        />

        <Tooltip content={<CustomTooltip />} />

        {/* The actual line */}
        <Line
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2, fill: '#161616' }}
        />
      </RechartsLine>
    </ResponsiveContainer>
  );
};

export default LineChartComponent;
