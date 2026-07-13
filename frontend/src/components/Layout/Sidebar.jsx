// Sidebar.jsx — Navigation sidebar component
// Shows on the left side of every page (when logged in)
// Contains the logo, navigation links, and logout button

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiList,
  FiPieChart,
  FiCpu,
  FiLogOut,
} from 'react-icons/fi';

const Sidebar = () => {
  // Get user info and logout function from AuthContext
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle logout — clear auth and go to login page
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get the user's initials for the avatar (e.g., "John Doe" → "JD")
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Navigation links — each has a path, label, and icon
  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiHome /> },
    { path: '/transactions', label: 'Transactions', icon: <FiList /> },
    { path: '/analytics', label: 'Analytics', icon: <FiPieChart /> },
    { path: '/ai-insights', label: 'AI Insights', icon: <FiCpu /> },
  ];

  return (
    <aside className="sidebar">
      {/* Logo section */}
      <div className="sidebar-logo">
        <h2>
          Spend<span>Sense</span>
        </h2>
        <p>AI Expense Tracker</p>
      </div>

      {/* Navigation links */}
      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer with user info and logout */}
      <div className="sidebar-footer">
        {/* User info */}
        <div className="user-info">
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div>
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
        </div>

        {/* Logout button */}
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
