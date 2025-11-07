import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    department: '',
    rollNumber: '',
    employeeId: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const roles = [
    { value: 'superadmin', label: 'Super Admin (Full Access)' },
    { value: 'student', label: 'Student' },
    { value: 'faculty', label: 'Faculty' },
    { value: 'hod', label: 'Head of Department (HOD)' },
    { value: 'placement', label: 'Training & Placement Head' },
    { value: 'faculty_head', label: 'Student Body - Faculty Head' },
    { value: 'team_rep', label: 'Student Body - Team Representative' },
    { value: 'sports', label: 'Sports Administrator' }
  ];

  const universities = [
    'JNTU Hyderabad', 'JNTU Kakinada', 'Osmania University', 
    'Andhra University', 'Other'
  ];

  const departments = [
    'Computer Science', 'Electronics', 'Mechanical', 'Civil', 
    'Electrical', 'IT', 'Other'
  ];

  // Validation
  const validateStep = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.role) newErrors.role = 'Please select a role';
    }

    if (step === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
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
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    if (step === 3) {
      if (!formData.university) newErrors.university = 'Please select university';
      if (!formData.department) newErrors.department = 'Please select department';
      
      if (formData.role === 'student' && !formData.rollNumber) {
        newErrors.rollNumber = 'Roll number is required for students';
      }
      if ((formData.role === 'faculty' || formData.role === 'hod') && !formData.employeeId) {
        newErrors.employeeId = 'Employee ID is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Store registration data
      sessionStorage.setItem('registeredUser', JSON.stringify(formData));
      
      showToast('Registration successful! Please login.', 'success');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      maxWidth: '500px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1F2937',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '14px'
    },
    progressBar: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '30px',
      position: 'relative'
    },
    progressStep: {
      width: '32%',
      height: '4px',
      backgroundColor: '#E5E7EB',
      borderRadius: '2px',
      overflow: 'hidden'
    },
    progressStepActive: {
      width: '32%',
      height: '4px',
      background: 'linear-gradient(90deg, #4F46E5 0%, #6366F1 100%)',
      borderRadius: '2px',
      boxShadow: '0 1px 4px rgba(79, 70, 229, 0.3)'
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
      transition: 'border-color 0.3s',
      boxSizing: 'border-box'
    },
    inputError: {
      borderColor: '#EF4444'
    },
    inputFocus: {
      borderColor: '#4F46E5'
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
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      marginTop: '24px'
    },
    button: {
      flex: 1,
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '600',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #4F46E5 0%, #6366F1 100%)',
      color: 'white',
      boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
    },
    buttonSecondary: {
      backgroundColor: '#F9FAFB',
      color: '#1F2937',
      border: '1px solid #E5E7EB'
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
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
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
    },
    link: {
      color: '#4F46E5',
      textDecoration: 'none',
      fontWeight: '600'
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
          <h2 style={styles.title}>Create Your Account</h2>
          <p style={styles.subtitle}>Step {step} of 3</p>
        </div>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div style={step >= 1 ? styles.progressStepActive : styles.progressStep}></div>
          <div style={step >= 2 ? styles.progressStepActive : styles.progressStep}></div>
          <div style={step >= 3 ? styles.progressStepActive : styles.progressStep}></div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Your Role *</label>
              <select
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
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  style={{...styles.input, ...(errors.fullName && styles.inputError)}}
                />
                {errors.fullName && <p style={styles.error}>{errors.fullName}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@university.edu"
                  style={{...styles.input, ...(errors.email && styles.inputError)}}
                />
                {errors.email && <p style={styles.error}>{errors.email}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  style={{...styles.input, ...(errors.password && styles.inputError)}}
                />
                {errors.password && <p style={styles.error}>{errors.password}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm Password *</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  style={{...styles.input, ...(errors.confirmPassword && styles.inputError)}}
                />
                {errors.confirmPassword && <p style={styles.error}>{errors.confirmPassword}</p>}
              </div>
            </>
          )}

          {/* Step 3: Organization Info */}
          {step === 3 && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>University *</label>
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  style={{...styles.select, ...(errors.university && styles.inputError)}}
                >
                  <option value="">Select your university</option>
                  {universities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
                {errors.university && <p style={styles.error}>{errors.university}</p>}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department *</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={{...styles.select, ...(errors.department && styles.inputError)}}
                >
                  <option value="">Select your department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <p style={styles.error}>{errors.department}</p>}
              </div>

              {formData.role === 'student' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Roll Number *</label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="Enter your roll number"
                    style={{...styles.input, ...(errors.rollNumber && styles.inputError)}}
                  />
                  {errors.rollNumber && <p style={styles.error}>{errors.rollNumber}</p>}
                </div>
              )}

              {(formData.role === 'faculty' || formData.role === 'hod') && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    placeholder="Enter your employee ID"
                    style={{...styles.input, ...(errors.employeeId && styles.inputError)}}
                  />
                  {errors.employeeId && <p style={styles.error}>{errors.employeeId}</p>}
                </div>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div style={styles.buttonGroup}>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                style={{...styles.button, ...styles.buttonSecondary}}
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                style={{...styles.button, ...styles.buttonPrimary}}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  ...styles.button,
                  ...styles.buttonPrimary,
                  ...(isLoading && styles.buttonDisabled)
                }}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            )}
          </div>
        </form>

        <div style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
