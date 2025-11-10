import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiBriefcase, FiCheckCircle } from 'react-icons/fi';
import API_CONFIG from '../../config/api.config';

const TrainerRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    type: 'External',
    university: '',
    department: '',
    organization: '',
    designation: '',
    qualification: '',
    experience: '',
    bio: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const API_BASE_URL = API_CONFIG.BASE_URL;

  // Fetch universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoadingData(true);
        const response = await fetch(`${API_BASE_URL}/setup/universities`);
        const data = await response.json();
        if (data.success && data.data) {
          setUniversities(data.data.universities || []);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
      } finally {
        setLoadingData(false);
      }
    };
    
    fetchUniversities();
  }, []);

  // Fetch departments when university is selected
  useEffect(() => {
    const fetchDepartments = async () => {
      if (formData.university) {
        try {
          setLoadingData(true);
          const response = await fetch(`${API_BASE_URL}/setup/departments?universityId=${formData.university}`);
          const data = await response.json();
          if (data.success && data.data) {
            setDepartments(data.data.departments || []);
          }
        } catch (error) {
          console.error('Error fetching departments:', error);
        } finally {
          setLoadingData(false);
        }
      } else {
        setDepartments([]);
      }
    };
    
    fetchDepartments();
  }, [formData.university]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Reset department when university changes
    if (name === 'university') {
      setFormData({ ...formData, university: value, department: '' });
      setDepartments([]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/trainers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('trainerToken', data.data.token);
        localStorage.setItem('trainerData', JSON.stringify(data.data));
        setStep(3); // Success step
        setTimeout(() => navigate('/trainer/dashboard'), 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Unable to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div style={styles.container}>
        <div style={styles.successBox}>
          <FiCheckCircle size={64} color="#10B981" />
          <h2 style={styles.successTitle}>Registration Successful!</h2>
          <p style={styles.successText}>Your account has been created and is pending verification.</p>
          <p style={styles.successSubtext}>Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.registerBox}>
        <div style={styles.header}>
          <h1 style={styles.title}>Trainer Registration</h1>
          <p style={styles.subtitle}>Join as a trainer for Vignan University</p>
        </div>

        <div style={styles.stepIndicator}>
          <div style={{...styles.stepDot, ...(step >= 1 && styles.stepDotActive)}}>1</div>
          <div style={{...styles.stepLine, ...(step >= 2 && styles.stepLineActive)}}></div>
          <div style={{...styles.stepDot, ...(step >= 2 && styles.stepDotActive)}}>2</div>
        </div>

        {error && (
          <div style={styles.errorAlert}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>Basic Information</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="john.smith@example.com"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="10-digit number"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <button type="button" style={styles.nextBtn} onClick={() => setStep(2)}>
                Next Step →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={styles.stepContent}>
              <h3 style={styles.stepTitle}>Professional Details</h3>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Trainer Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} style={styles.input} required>
                  <option value="External">External</option>
                  <option value="Internal">Internal (Vignan University)</option>
                  <option value="Guest">Guest</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>University *</label>
                <select 
                  name="university" 
                  value={formData.university} 
                  onChange={handleChange} 
                  style={styles.input}
                  disabled={loadingData}
                  required
                >
                  <option value="">Select University</option>
                  {universities.map(uni => (
                    <option key={uni._id} value={uni._id}>{uni.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Department *</label>
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange} 
                  style={styles.input}
                  disabled={!formData.university || loadingData}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Organization *</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Company or Institution name"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Designation *</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., Senior Consultant"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Qualification *</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., Ph.D. in Computer Science"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience (Years) *</label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="Years of professional experience"
                  min="0"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bio (Optional)</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  style={{...styles.input, minHeight: '100px'}}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div style={styles.buttonGroup}>
                <button type="button" style={styles.backBtn} onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button type="submit" style={styles.submitBtn} disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Already have an account?{' '}
            <Link to="/trainer/login" style={styles.link}>Login here</Link>
          </p>
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
  registerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '550px'
  },
  successBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    padding: '60px 40px',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center'
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
  stepIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '32px'
  },
  stepDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#E5E7EB',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px'
  },
  stepDotActive: {
    backgroundColor: '#4F46E5',
    color: '#FFFFFF'
  },
  stepLine: {
    width: '60px',
    height: '2px',
    backgroundColor: '#E5E7EB'
  },
  stepLineActive: {
    backgroundColor: '#4F46E5'
  },
  errorAlert: {
    padding: '12px',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '8px',
    fontSize: '14px',
    marginBottom: '24px'
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '8px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    outline: 'none'
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '8px'
  },
  nextBtn: {
    padding: '12px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  backBtn: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#6B7280',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  submitBtn: {
    flex: 2,
    padding: '12px',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '14px',
    color: '#6B7280',
    margin: 0
  },
  link: {
    color: '#4F46E5',
    textDecoration: 'none',
    fontWeight: '600'
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
    margin: '24px 0 12px 0'
  },
  successText: {
    fontSize: '16px',
    color: '#6B7280',
    margin: '0 0 8px 0'
  },
  successSubtext: {
    fontSize: '14px',
    color: '#9CA3AF',
    margin: 0
  }
};

export default TrainerRegister;
