import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';

const TrainerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    try {
      const response = await fetch(`${API_BASE_URL}/trainers/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('trainerToken', data.data.token);
        localStorage.setItem('trainerData', JSON.stringify(data.data));
        navigate('/trainer/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>Trainer Login</h1>
          <p style={styles.subtitle}>Sign in to access your trainer portal</p>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            <FiAlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Address</label>
            <div style={styles.inputWrapper}>
              <FiMail style={styles.icon} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="trainer@example.com"
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <FiLock style={styles.icon} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                style={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Don't have an account?{' '}
            <Link to="/trainer/register" style={styles.link}>
              Register here
            </Link>
          </p>
          <Link to="/" style={styles.link}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    padding: '24px'
  },
  loginBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '48px',
    width: '100%',
    maxWidth: '450px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  },
  errorAlert: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '24px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  icon: {
    position: 'absolute',
    left: '12px',
    color: '#9CA3AF',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s'
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    color: '#9CA3AF',
    cursor: 'pointer',
    padding: '4px'
  },
  submitBtn: {
    padding: '14px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: '8px'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  footerText: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  },
  link: {
    color: '#4F46E5',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px'
  }
};

export default TrainerLogin;
