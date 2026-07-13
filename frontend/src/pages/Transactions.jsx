// Transactions.jsx — Transactions Page
// Full CRUD: Add, Edit, Delete transactions with search and filter

import { useState, useEffect, useMemo } from 'react';
import { useTransactions } from '../context/TransactionContext';
import {
  formatCurrency,
  formatDate,
  getCategoryIcon,
  expenseCategories,
  incomeCategories,
} from '../utils/helpers';
import Modal from '../components/Common/Modal';
import Loader from '../components/Common/Loader';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';

const Transactions = () => {
  // Get transaction data and CRUD functions
  const {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions();

  // Modal state — controls whether the add/edit form is visible
  const [showModal, setShowModal] = useState(false);

  // Which transaction is being edited (null = adding new)
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Filter state — for searching and filtering the transaction list
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterCategory, setFilterCategory] = useState('all');

  // Form state — for the add/edit form inside the modal
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
    description: '',
  });

  // Fetch transactions when page loads
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter and search transactions
  // useMemo = only recalculate when dependencies change
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Filter by type (income/expense)
        if (filterType !== 'all' && t.type !== filterType) return false;

        // Filter by category
        if (filterCategory !== 'all' && t.category !== filterCategory) return false;

        // Search by title (case-insensitive)
        if (
          searchTerm &&
          !t.title.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first
  }, [transactions, filterType, filterCategory, searchTerm]);

  // Open modal for adding a new transaction
  const handleAdd = () => {
    setEditingTransaction(null);
    setFormData({
      title: '',
      amount: '',
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      description: '',
    });
    setShowModal(true);
  };

  // Open modal for editing an existing transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      title: transaction.title,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date.split('T')[0], // Convert to YYYY-MM-DD
      description: transaction.description || '',
    });
    setShowModal(true);
  };

  // Delete a transaction (with confirmation)
  const handleDelete = async (id) => {
    // Ask user to confirm before deleting
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  // Handle form submission (both add and edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for the backend
    const data = {
      ...formData,
      amount: parseFloat(formData.amount), // Convert string to number
    };

    if (editingTransaction) {
      // If we're editing, call update
      const result = await updateTransaction(editingTransaction._id, data);
      if (result.success) setShowModal(false);
    } else {
      // If we're adding new, call add
      const result = await addTransaction(data);
      if (result.success) setShowModal(false);
    }
  };

  // Update form data when user types in a field
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      // When type changes, reset category to first option of that type
      if (name === 'type') {
        updated.category = value === 'income' ? 'Salary' : 'Food';
      }

      return updated;
    });
  };

  // Get the right category list based on income/expense type
  const currentCategories =
    formData.type === 'income' ? incomeCategories : expenseCategories;

  // All categories for the filter dropdown
  const allCategories = [...new Set(transactions.map((t) => t.category))];

  if (loading) return <Loader />;

  return (
    <div className="fade-in">
      {/* Page header with Add button */}
      <div className="transactions-header">
        <div className="page-header">
          <h1>Transactions</h1>
          <p>Manage your income and expenses</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <FiPlus /> Add Transaction
        </button>
      </div>

      {/* Filters bar — search, type filter, category filter */}
      <div className="filters-bar">
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <FiSearch
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0a0b8',
            }}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: 36, width: '100%' }}
          />
        </div>

        {/* Type filter dropdown */}
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category filter dropdown */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {allCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction list */}
      {filteredTransactions.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📋</div>
          <h3>No transactions found</h3>
          <p>
            {searchTerm || filterType !== 'all' || filterCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Click "Add Transaction" to get started'}
          </p>
        </div>
      ) : (
        <div className="transaction-list">
          {filteredTransactions.map((t) => {
            const IconComponent = getCategoryIcon(t.category);

            return (
              <div key={t._id} className="transaction-list-item">
                {/* Left side — icon + details */}
                <div className="t-info">
                  <div className="t-icon">
                    <IconComponent />
                  </div>
                  <div className="t-details">
                    <h4>{t.title}</h4>
                    <p>
                      {t.category} • {formatDate(t.date)}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div
                  className={`t-amount ${
                    t.type === 'income' ? 'text-success' : 'text-danger'
                  }`}
                >
                  {t.type === 'income' ? '+' : '-'}
                  {formatCurrency(t.amount)}
                </div>

                {/* Action buttons — edit and delete */}
                <div className="t-actions">
                  <button onClick={() => handleEdit(t)} title="Edit">
                    <FiEdit2 />
                  </button>
                  <button
                    className="delete"
                    onClick={() => handleDelete(t._id)}
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
      >
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Title</label>
            <input
              name="title"
              type="text"
              placeholder="e.g., Grocery shopping"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label>Amount (₹)</label>
            <input
              name="amount"
              type="number"
              placeholder="e.g., 500"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          {/* Type — income or expense */}
          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* Category — changes based on type */}
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label>Date</label>
            <input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description (optional) */}
          <div className="form-group">
            <label>Description (optional)</label>
            <input
              name="description"
              type="text"
              placeholder="Add a note..."
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* Form action buttons */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTransaction ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
