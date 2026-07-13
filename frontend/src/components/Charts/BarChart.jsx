// BarChart.jsx — Reusable Bar Chart Component
// Uses Recharts library to display monthly income/expense comparison

import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * BarChartComponent
 * @param {Array} data - Array like [{ month: 'Jan', income: 5000, expenses: 3000 }, ...]
 * @param {number} height - Chart height in pixels (default: 300)
 */
const BarChartComponent = ({ data = [], height = 300 }) => {
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
          <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
          {payload.map((item) => (
            <p key={item.name} style={{ color: item.color }}>
              {item.name}: ₹{item.value.toLocaleString('en-IN')}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBar data={data} barGap={4} barSize={20}>
        {/* Subtle grid lines */}
        <CartesianGrid strokeDasharray="3 3" stroke="#262626" />

        {/* X axis — shows month names */}
        <XAxis
          dataKey="month"
          tick={{ fill: '#6e6e6e', fontSize: 12 }}
          axisLine={{ stroke: '#262626' }}
          tickLine={false}
        />

        {/* Y axis — shows amounts */}
        <YAxis
          tick={{ fill: '#6e6e6e', fontSize: 12 }}
          axisLine={{ stroke: '#262626' }}
          tickLine={false}
          tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
        />

        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '0.8rem', color: '#a3a3a3' }}
        />

        {/* Green bars for income */}
        <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />

        {/* Red bars for expenses */}
        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;
