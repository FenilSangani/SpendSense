import { useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatDate, getCategoryIcon } from '../utils/helpers';
import PieChartComponent from '../components/Charts/PieChart';
import BarChartComponent from '../components/Charts/BarChart';
import Loader from '../components/Common/Loader';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { format } from 'date-fns';

const FiIndianRupee = () => (
  <span style={{ fontWeight: 'bold', fontSize: '1.4rem', lineHeight: 1 }}>₹</span>
);

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, summary, loading, fetchTransactions } = useTransactions();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  const categoryData = useMemo(() => {
    const categories = {};

    transactions.forEach((t) => {
      if (t.type === 'expense') {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      }
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const months = {};

    transactions.forEach((t) => {
      if (!t.date) return;

      try {
        const monthKey = format(new Date(t.date), 'MMM yyyy');

        if (!months[monthKey]) {
          months[monthKey] = { month: monthKey, income: 0, expenses: 0 };
        }

        if (t.type === 'income') {
          months[monthKey].income += t.amount;
        } else {
          months[monthKey].expenses += t.amount;
        }
      } catch (error) {
        console.error('Error formatting monthly data:', error);
      }
    });

    return Object.values(months).slice(-6);
  }, [transactions]);

  if (loading) return <Loader />;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
        <p>Here's your financial overview</p>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon balance">
            <FiIndianRupee />
          </div>
          <div className="stat-info">
            <h3>Total Balance</h3>
            <p>{formatCurrency(summary.balance)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon income">
            <FiTrendingUp />
          </div>
          <div className="stat-info">
            <h3>Total Income</h3>
            <p className="text-success">{formatCurrency(summary.totalIncome)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon expense">
            <FiTrendingDown />
          </div>
          <div className="stat-info">
            <h3>Total Expenses</h3>
            <p className="text-danger">{formatCurrency(summary.totalExpenses)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="recent-transactions">
          <h2>Recent Transactions</h2>

          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <p>No transactions yet. Add your first one!</p>
            </div>
          ) : (
            recentTransactions.map((t) => {
              const IconComponent = getCategoryIcon(t.category);

              return (
                <div key={t._id} className="transaction-item">
                  <div className="transaction-left">
                    <div className="transaction-icon">
                      <IconComponent />
                    </div>
                    <div>
                      <div className="transaction-title">{t.note || 'No description'}</div>
                      <div className="transaction-category">{t.category}</div>
                    </div>
                  </div>
                  <div>
                    <div className={`transaction-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </div>
                    <div className="transaction-date">
                      {formatDate(t.date)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div>
          <div className="chart-container" style={{ marginBottom: 20 }}>
            <h2>Expenses by Category</h2>
            <PieChartComponent data={categoryData} height={280} />
          </div>

          <div className="chart-container">
            <h2>Monthly Overview</h2>
            <BarChartComponent data={monthlyData} height={250} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
