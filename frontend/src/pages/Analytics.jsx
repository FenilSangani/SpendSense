// Analytics.jsx — Analytics Page
// Shows detailed charts: category donut, monthly comparison, daily spending, top categories

import { useEffect, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, chartColors } from '../utils/helpers';
import PieChartComponent from '../components/Charts/PieChart';
import BarChartComponent from '../components/Charts/BarChart';
import LineChartComponent from '../components/Charts/LineChart';
import Loader from '../components/Common/Loader';
import { format, parseISO } from 'date-fns';

const Analytics = () => {
  const { transactions, loading, fetchTransactions } = useTransactions();

  // Fetch transactions when page loads
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 1. Category donut chart data — group expenses by category
  const categoryData = useMemo(() => {
    const categories = {};

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      }
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value); // Sort by highest spending
  }, [transactions]);

  // 2. Monthly comparison data — income vs expenses per month
  const monthlyData = useMemo(() => {
    const months = {};

    transactions.forEach((t) => {
      const monthKey = format(parseISO(t.date), 'MMM yyyy');

      if (!months[monthKey]) {
        months[monthKey] = { month: monthKey, income: 0, expenses: 0 };
      }

      if (t.type === 'income') {
        months[monthKey].income += t.amount;
      } else {
        months[monthKey].expenses += t.amount;
      }
    });

    return Object.values(months).slice(-6);
  }, [transactions]);

  // 3. Daily spending data — for line chart (last 30 days of expenses)
  const dailyData = useMemo(() => {
    const days = {};

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        const dayKey = format(parseISO(t.date), 'dd MMM');
        days[dayKey] = (days[dayKey] || 0) + t.amount;
      }
    });

    // Convert to array and take last 15 entries
    return Object.entries(days)
      .map(([date, amount]) => ({ date, amount }))
      .slice(-15);
  }, [transactions]);

  // 4. Top categories — sorted by spending amount (for the list)
  const topCategories = useMemo(() => {
    if (categoryData.length === 0) return [];

    // Find the highest spending category for percentage bar width
    const maxValue = Math.max(...categoryData.map((c) => c.value));

    return categoryData.map((cat, index) => ({
      ...cat,
      percentage: ((cat.value / maxValue) * 100).toFixed(0),
      color: chartColors[index % chartColors.length],
    }));
  }, [categoryData]);

  if (loading) return <Loader />;

  return (
    <div className="fade-in">
      {/* Page header */}
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Detailed insights into your spending patterns</p>
      </div>

      {/* Analytics grid — 2 columns of charts */}
      <div className="analytics-grid">
        {/* Category donut chart */}
        <div className="chart-container">
          <h2>Spending by Category</h2>
          <PieChartComponent data={categoryData} height={300} />
        </div>

        {/* Monthly comparison bar chart */}
        <div className="chart-container">
          <h2>Monthly Comparison</h2>
          <BarChartComponent data={monthlyData} height={300} />
        </div>

        {/* Daily spending line chart */}
        <div className="chart-container">
          <h2>Daily Spending Trend</h2>
          <LineChartComponent data={dailyData} height={300} />
        </div>

        {/* Top categories list */}
        <div className="chart-container">
          <h2>Top Expense Categories</h2>

          {topCategories.length === 0 ? (
            <div className="empty-state">
              <p>No expense data yet</p>
            </div>
          ) : (
            <ul className="top-categories">
              {topCategories.map((cat) => (
                <li key={cat.name}>
                  {/* Category name */}
                  <span style={{ fontSize: '0.85rem', minWidth: 80 }}>
                    {cat.name}
                  </span>

                  {/* Progress bar showing relative spending */}
                  <div className="category-bar">
                    <div
                      className="category-bar-fill"
                      style={{
                        width: `${cat.percentage}%`,
                        background: cat.color,
                      }}
                    />
                  </div>

                  {/* Amount */}
                  <span
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      minWidth: 80,
                      textAlign: 'right',
                    }}
                  >
                    {formatCurrency(cat.value)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
