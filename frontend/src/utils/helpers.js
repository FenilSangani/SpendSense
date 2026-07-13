// helpers.js — Utility/helper functions used throughout the app
// These are small reusable functions that format data for display

import { format, parseISO } from 'date-fns';
import {
  FiShoppingCart,
  FiHome,
  FiTruck,
  FiFilm,
  FiHeart,
  FiBook,
  FiCoffee,
  FiDollarSign,
  FiBriefcase,
  FiGift,
  FiWifi,
  FiMoreHorizontal,
} from 'react-icons/fi';

/**
 * formatCurrency — Formats a number as Indian Rupee currency
 * Example: 1500 → "₹1,500.00"
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

/**
 * formatDate — Formats a date string into a readable format
 * Example: "2024-01-15T10:30:00Z" → "Jan 15, 2024"
 * @param {string} dateString - ISO date string from the backend
 * @returns {string} Formatted date like "Jan 15, 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    // parseISO converts the string to a Date object
    // format converts it to "MMM dd, yyyy" like "Jan 15, 2024"
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

/**
 * getCategoryIcon — Returns the matching Feather icon component for a category
 * Each expense/income category has its own icon
 * @param {string} category - Category name like "Food", "Transport"
 * @returns {React.ComponentType} The icon component to render
 */
export const getCategoryIcon = (category) => {
  // Map each category name to its icon
  const iconMap = {
    Food: FiCoffee,
    Transport: FiTruck,
    Shopping: FiShoppingCart,
    Entertainment: FiFilm,
    Health: FiHeart,
    Education: FiBook,
    Housing: FiHome,
    Utilities: FiWifi,
    Salary: FiBriefcase,
    Freelance: FiBriefcase,
    Investment: FiDollarSign,
    Gift: FiGift,
    Other: FiMoreHorizontal,
  };

  // Return the matching icon, or a default dollar icon if not found
  return iconMap[category] || FiDollarSign;
};

/**
 * Category lists — Used in dropdowns for the transaction form
 */
export const expenseCategories = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Health',
  'Education',
  'Housing',
  'Utilities',
  'Other',
];

export const incomeCategories = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
];

/**
 * Category colors — Colors for chart slices
 * Each category gets a unique color in pie/bar charts
 */
export const categoryColors = {
  Food: '#ff6a00',
  Transport: '#ff8533',
  Shopping: '#ffb84d',
  Entertainment: '#e05e00',
  Health: '#10b981',
  Education: '#8c7b70',
  Housing: '#d4d4d4',
  Utilities: '#737373',
  Salary: '#10b981',
  Freelance: '#34d399',
  Investment: '#ff6a00',
  Gift: '#ffb84d',
  Other: '#404040',
};

/**
 * Chart color palette — Array of colors for chart slices
 */
export const chartColors = [
  '#ff6a00',
  '#ff8533',
  '#ffb84d',
  '#10b981',
  '#8c7b70',
  '#d4d4d4',
  '#737373',
  '#e05e00',
  '#404040',
  '#a3a3a3',
];
