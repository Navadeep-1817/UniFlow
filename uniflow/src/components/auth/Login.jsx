import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const roles = [
    { value: 'superadmin', label: 'Super Admin' },
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'academic_admin_hod', label: 'Head of Department (HOD)' },
    { value: 'academic_admin_tp', label: 'Training & Placement Head' },
    { value: 'non_academic_faculty_head', label: 'Student Body - Faculty Head' },
    { value: 'non_academic_team_rep', label: 'Student Body - Team Representative' },
    { value: 'sports', label: 'Sports Administrator' },
    { value: 'trainer', label: 'Trainer' }
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Redirect to trainer login if trainer role is selected
    if (formData.role === 'trainer') {
      navigate('/trainer/login');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔐 Attempting login with:', {
        email: formData.email,
        role: formData.role
      });
      const response = await login(formData);
      console.log('✅ Login successful:', response);
      
      showToast('Login successful! Redirecting...', 'success');

      // Get user role from response
      const userRole = response.data.user.role;
      
      // Map backend role to frontend route
      const roleRouteMap = {
        'superadmin': '/superadmin/dashboard',
        'student': '/student/dashboard',
        'faculty': '/faculty/dashboard',
        'academic_admin_hod': '/hod/dashboard',
        'academic_admin_tp': '/placement/dashboard',
        'non_academic_faculty_head': '/student-body/faculty-head/dashboard',
        'non_academic_team_rep': '/teamrep/dashboard',
        'sports': '/sports/dashboard'
      };

      setTimeout(() => {
        const route = roleRouteMap[userRole] || '/dashboard';
        navigate(route);
      }, 1000);
    } catch (error) {
      const errorMessage = error.message || 'Invalid credentials. Please try again.';
      showToast(errorMessage, 'error');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(79, 70, 229, 0.12)',
      border: '1px solid #E5E7EB',
      padding: '40px',
      width: '100%',
      maxWidth: '450px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    logo: {
      width: '64px',
      height: '64px',
      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      borderRadius: '50%',
      margin: '0 auto 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      color: 'white',
      fontWeight: 'bold',
      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1F2937',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '14px',
      margin: 0
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#1F2937',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      outline: 'none',
      backgroundColor: 'white',
      color: '#1F2937',
      boxSizing: 'border-box'
    },
    inputError: {
      borderColor: '#EF4444'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '14px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      outline: 'none',
      backgroundColor: 'white',
      color: '#1F2937',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    error: {
      color: '#EF4444',
      fontSize: '12px',
      marginTop: '4px'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px'
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '14px',
      color: '#1F2937'
    },
    checkbox: {
      marginRight: '8px'
    },
    link: {
      color: '#4F46E5',
      textDecoration: 'none',
      fontSize: '14px',
      fontWeight: '600'
    },
    button: {
      width: '100%',
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: '10px',
      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
    },
    buttonDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    },
    toast: {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '16px 24px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '500',
      zIndex: 1000
    },
    toastSuccess: {
      backgroundColor: '#10b981'
    },
    toastError: {
      backgroundColor: '#ef4444'
    },
    footer: {
      textAlign: 'center',
      marginTop: '20px',
      fontSize: '14px',
      color: '#6B7280'
    }
  };

  return (
    <div style={styles.container}>
      {toast.show && (
        <div style={{...styles.toast, ...(toast.type === 'success' ? styles.toastSuccess : styles.toastError)}}>
          {toast.message}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>UF</div>
          <h2 style={styles.title}>Welcome to UniFlow</h2>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@university.edu"
              style={{...styles.input, ...(errors.email && styles.inputError)}}
            />
            {errors.email && <p style={styles.error}>{errors.email}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              style={{...styles.input, ...(errors.password && styles.inputError)}}
            />
            {errors.password && <p style={styles.error}>{errors.password}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="role">Select Your Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{...styles.select, ...(errors.role && styles.inputError)}}
            >
              <option value="">Choose your role</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label}</option>
              ))}
            </select>
            {errors.role && <p style={styles.error}>{errors.role}</p>}
          </div>

          <div style={styles.checkboxContainer}>
            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                style={styles.checkbox}
              />
              Remember me
            </label>
            <Link to="/forgot-password" style={styles.link}>Forgot password?</Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{...styles.button, ...(isLoading && styles.buttonDisabled)}}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
