// Register.jsx — Registration Page
// A form where new users create an account with name, email, and password

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const Register = () => {
  // Form state — stores what the user types
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get register function from AuthContext
  const { register } = useAuth();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match before sending to backend
    if (password !== confirmPassword) {
      // We import toast directly here for this one-off use
      const { default: toast } = await import('react-hot-toast');
      toast.error('Passwords do not match!');
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    // Call register function from AuthContext
    const result = await register(name, email, password);

    if (result.success) {
      navigate('/dashboard');
    }

    setIsSubmitting(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        {/* Logo */}
        <div className="logo">
          <h1>
            Spend<span>Sense</span>
          </h1>
          <p>Create your free account</p>
        </div>

        {/* Registration Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Name field */}
          <div className="form-group">
            <label htmlFor="name">
              <FiUser style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">
              <FiMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">
              <FiLock style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Confirm password field */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FiLock style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Link to login page */}
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
