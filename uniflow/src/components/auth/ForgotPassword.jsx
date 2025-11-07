import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowLeft, FiCheck, FiEye, FiEyeOff } from 'react-icons/fi';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const timerRef = useRef(null);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      startTimer();
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  const handleResendOtp = () => {
    setTimer(60);
    setOtp(['', '', '', '', '', '']);
    startTimer();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '40px',
      width: '100%',
      maxWidth: '480px',
      boxShadow: '0 4px 20px rgba(79, 70, 229, 0.15)',
      border: '1px solid #E0E7FF'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    logo: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#4F46E5',
      marginBottom: '8px'
    },
    title: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1F2937',
      margin: '16px 0 8px 0'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
      margin: 0
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    inputGroup: {
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
      left: '16px',
      color: '#4F46E5'
    },
    input: {
      width: '100%',
      padding: '12px 16px 12px 48px',
      fontSize: '14px',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.3s',
      boxSizing: 'border-box'
    },
    otpContainer: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center'
    },
    otpInput: {
      width: '50px',
      height: '56px',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      border: '2px solid #E5E7EB',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.3s'
    },
    button: {
      width: '100%',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      color: 'white',
      backgroundColor: '#4F46E5',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      marginTop: '8px'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#4F46E5',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '8px 0',
      marginBottom: '16px'
    },
    error: {
      padding: '12px',
      backgroundColor: '#FEE2E2',
      color: '#991B1B',
      borderRadius: '8px',
      fontSize: '14px',
      textAlign: 'center'
    },
    timer: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#6B7280',
      marginTop: '16px'
    },
    resendLink: {
      color: '#4F46E5',
      fontWeight: '600',
      cursor: 'pointer',
      textDecoration: 'underline'
    },
    successIcon: {
      width: '64px',
      height: '64px',
      margin: '0 auto 16px',
      backgroundColor: '#D1FAE5',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    eyeIcon: {
      position: 'absolute',
      right: '16px',
      cursor: 'pointer',
      color: '#4F46E5'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {step > 1 && (
          <button style={styles.backButton} onClick={() => setStep(step - 1)}>
            <FiArrowLeft size={18} /> Back
          </button>
        )}

        <div style={styles.header}>
          <div style={styles.logo}>UniFlow</div>
          
          {step === 1 && (
            <>
              <h2 style={styles.title}>Forgot Password?</h2>
              <p style={styles.subtitle}>Enter your email to receive a verification code</p>
            </>
          )}
          
          {step === 2 && (
            <>
              <h2 style={styles.title}>Verify OTP</h2>
              <p style={styles.subtitle}>Enter the 6-digit code sent to {email}</p>
            </>
          )}
          
          {step === 3 && (
            <>
              <div style={styles.successIcon}>
                <FiCheck size={32} color="#10B981" />
              </div>
              <h2 style={styles.title}>Set New Password</h2>
              <p style={styles.subtitle}>Create a strong password for your account</p>
            </>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {/* Step 1: Email */}
        {step === 1 && (
          <form style={styles.form} onSubmit={handleEmailSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <FiMail size={20} style={styles.icon} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{ ...styles.backButton, margin: '0 auto', justifyContent: 'center' }}
              >
                <FiArrowLeft size={16} /> Back to Login
              </button>
            </div>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form style={styles.form} onSubmit={handleOtpSubmit}>
            <div style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  style={styles.otpInput}
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
              ))}
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div style={styles.timer}>
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : (
                <span>
                  Didn't receive code?{' '}
                  <span style={styles.resendLink} onClick={handleResendOtp}>
                    Resend OTP
                  </span>
                </span>
              )}
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form style={styles.form} onSubmit={handlePasswordSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <div style={styles.inputWrapper}>
                <FiLock size={20} style={styles.icon} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
                <div style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </div>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm Password</label>
              <div style={styles.inputWrapper}>
                <FiLock size={20} style={styles.icon} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                />
                <div style={styles.eyeIcon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </div>
              </div>
            </div>

            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
