import { createContext, useState, useContext, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

const TransactionContext = createContext();

export const useTransactions = () => {
  return useContext(TransactionContext);
};

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const mapTransactions = (dataList) => {
    if (!Array.isArray(dataList)) return [];
    return dataList.map((t) => ({
      ...t,
      title: t.note || 'No description',
      description: t.note || '',
    }));
  };

  const mapForBackend = (data) => {
    return {
      type: data.type,
      amount: data.amount,
      category: data.category,
      note: data.title || data.description || '',
      date: data.date,
    };
  };

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await api.get('/transactions');
      const data = mapTransactions(response.data.data);
      setTransactions(data);
      calculateSummary(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const calculateSummary = (data) => {
    let totalIncome = 0;
    let totalExpenses = 0;

    data.forEach((transaction) => {
      if (transaction.type === 'income') {
        totalIncome += transaction.amount;
      } else {
        totalExpenses += transaction.amount;
      }
    });

    setSummary({
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
    });
  };

  const addTransaction = async (transactionData) => {
    try {
      const response = await api.post('/transactions', mapForBackend(transactionData));
      const newTransaction = mapTransactions([response.data.data])[0];
      const updatedList = [newTransaction, ...transactions];
      setTransactions(updatedList);
      calculateSummary(updatedList);
      toast.success('Transaction added!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add transaction';
      toast.error(message);
      return { success: false, message };
    }
  };

  const updateTransaction = async (id, transactionData) => {
    try {
      const response = await api.put(`/transactions/${id}`, mapForBackend(transactionData));
      const updatedTransaction = mapTransactions([response.data.data])[0];
      const updatedList = transactions.map((t) =>
        t._id === id ? updatedTransaction : t
      );
      setTransactions(updatedList);
      calculateSummary(updatedList);
      toast.success('Transaction updated!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update transaction';
      toast.error(message);
      return { success: false, message };
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      const updatedList = transactions.filter((t) => t._id !== id);
      setTransactions(updatedList);
      calculateSummary(updatedList);
      toast.success('Transaction deleted!');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete transaction');
      return { success: false };
    }
  };

  const value = {
    transactions,
    summary,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;
