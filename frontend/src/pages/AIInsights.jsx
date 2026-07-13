import { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import Loader from '../components/Common/Loader';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  FiCpu,
  FiTrendingUp,
  FiAlertCircle,
  FiTarget,
  FiBarChart2,
} from 'react-icons/fi';

const FiIndianRupee = () => (
  <span style={{ fontWeight: 'bold', fontSize: '1.2rem', lineHeight: 1 }}>₹</span>
);

const AIInsights = () => {
  const { transactions, fetchTransactions } = useTransactions();
  const [insights, setInsights] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const insightIcons = [
    <FiTrendingUp />,
    <FiAlertCircle />,
    <FiTarget />,
    <FiIndianRupee />,
    <FiBarChart2 />,
    <FiCpu />,
  ];

  const generateInsights = async () => {
    if (transactions.length === 0) {
      toast.error('Add some transactions first to get AI insights!');
      return;
    }

    setGenerating(true);

    try {
      const response = await api.post('/insights/generate');
      const responseData = response.data;

      if (responseData.success && responseData.data) {
        const rawInsights = responseData.data.insights || '';
        const tips = rawInsights.split('\n\n').filter(tip => tip.trim() !== '');

        const parsedInsights = tips.map((tipText, idx) => {
          let title = `Financial Tip ${idx + 1}`;
          let description = tipText;

          if (tipText.includes(':')) {
            const parts = tipText.split(':');
            const possibleTitle = parts[0].replace(/\*+/g, '').trim();
            if (possibleTitle.length < 35) {
              title = possibleTitle;
              description = parts.slice(1).join(':').trim();
            }
          } else {
            const lowerText = tipText.toLowerCase();
            if (lowerText.includes('saving') || lowerText.includes('habit')) {
              title = 'Savings Analysis';
            } else if (lowerText.includes('expense') || lowerText.includes('overspending') || lowerText.includes('biggest')) {
              title = 'Spending Alert';
            } else if (lowerText.includes('deficit') || lowerText.includes('balance')) {
              title = 'Balance Insight';
            } else if (lowerText.includes('budget')) {
              title = 'Budget Strategy';
            }
          }

          description = description.replace(/\*+/g, '').trim();

          return {
            title: title,
            description: description,
            type: 'tip',
          };
        });

        setInsights(parsedInsights);
        setHasGenerated(true);
        toast.success('AI insights generated!');
      } else {
        toast.error('Could not generate insights.');
      }
    } catch (error) {
      console.error('Error generating insights:', error);

      const sampleInsights = [
        {
          title: 'Spending Overview',
          description:
            'Based on your recent transactions, your spending is well-distributed across categories. Consider setting monthly budgets for each category to maintain control over your finances.',
          type: 'overview',
        },
        {
          title: 'Top Spending Category',
          description:
            'Your highest spending category appears to be recurring expenses. Look for subscriptions or memberships you may not be actively using and consider canceling them.',
          type: 'warning',
        },
        {
          title: 'Savings Potential',
          description:
            'You could potentially save more by reducing discretionary spending by 10-15%. Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
          type: 'tip',
        },
        {
          title: 'Income Trend',
          description:
            'Your income has been consistent. Consider diversifying your income streams through freelancing or investments to build a stronger financial foundation.',
          type: 'growth',
        },
        {
          title: 'Smart Budget Tip',
          description:
            'Track your daily expenses for a week to identify "invisible" spending — small purchases that add up over time, like daily coffee or snacks.',
          type: 'tip',
        },
      ];

      setInsights(sampleInsights);
      setHasGenerated(true);
      toast.success('Showing sample insights');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>AI Insights</h1>
        <p>Get personalized financial advice powered by AI</p>
      </div>

      <div style={{ marginBottom: 24 }}>
        <button
          className="btn btn-primary"
          onClick={generateInsights}
          disabled={generating}
          style={{ padding: '12px 28px', fontSize: '1rem' }}
        >
          <FiCpu />
          {generating
            ? 'Analyzing your data...'
            : hasGenerated
            ? 'Regenerate Insights'
            : 'Generate AI Insights'}
        </button>

        <p style={{ color: '#a0a0b8', fontSize: '0.85rem', marginTop: 8 }}>
          {transactions.length > 0
            ? `Analyzing ${transactions.length} transactions...`
            : 'Add transactions first to get personalized insights'}
        </p>
      </div>

      {generating && <Loader />}

      {!generating && insights.length > 0 && (
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-icon">
                {insightIcons[index % insightIcons.length]}
              </div>
              <h3>{insight.title}</h3>
              <p>{insight.description}</p>
            </div>
          ))}
        </div>
      )}

      {!generating && !hasGenerated && (
        <div className="empty-state card" style={{ marginTop: 20 }}>
          <div className="empty-icon">
            <FiCpu />
          </div>
          <h3>No insights yet</h3>
          <p>
            Click the button above to get AI-powered analysis of your spending
            habits
          </p>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
