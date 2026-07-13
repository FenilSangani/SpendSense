// PieChart.jsx — Reusable Pie/Donut Chart Component
// Uses Recharts library to display category-wise data as a donut chart

import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { chartColors } from '../../utils/helpers';

/**
 * PieChartComponent
 * @param {Array} data - Array of objects like [{ name: 'Food', value: 500 }, ...]
 * @param {number} height - Chart height in pixels (default: 300)
 */
const PieChartComponent = ({ data = [], height = 300 }) => {
  // Don't render if there's no data
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <p>No data available</p>
      </div>
    );
  }

  // Custom tooltip that shows when hovering over a slice
  const CustomTooltip = ({ active, payload }) => {
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
          <p style={{ fontWeight: 600 }}>{payload[0].name}</p>
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
      <RechartsPie>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          stroke="none"
        >
          {/* Each slice gets a different color */}
          {data.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={chartColors[index % chartColors.length]}
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: '0.8rem', color: '#a3a3a3' }}
        />
      </RechartsPie>
    </ResponsiveContainer>
  );
};

export default PieChartComponent;
