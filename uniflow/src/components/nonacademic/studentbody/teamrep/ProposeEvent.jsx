import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, FiMapPin, FiDollarSign, FiFileText,
  FiArrowLeft, FiSend, FiClock, FiUsers, FiCheckCircle
} from 'react-icons/fi';

const ProposeEvent = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    name: '',
    type: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    budget: '',
    expectedAttendees: '',
    description: '',
    objectives: '',
    requirements: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!eventData.name || !eventData.type || !eventData.date || !eventData.venue) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting event proposal:', eventData);
      // TODO: API call to submit proposal
      // await api.post('/teamrep/events/propose', eventData);
      showToast('Event proposal submitted successfully!', 'success');
      setTimeout(() => navigate('/teamrep/dashboard'), 2000);
    } catch (error) {
      showToast('Failed to submit proposal. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #E5E7EB',
      padding: '20px 40px'
    },
    backButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      backgroundColor: 'transparent',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      transition: 'all 0.3s',
      marginBottom: '20px'
    },
    content: {
      padding: '32px 40px',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#111827',
      marginBottom: '8px'
    },
    subtitle: {
      fontSize: '14px',
      color: '#6B7280',
      marginBottom: '32px'
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '32px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #E5E7EB'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    required: {
      color: '#EF4444'
    },
    input: {
      padding: '12px 16px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#111827',
      transition: 'all 0.3s',
      outline: 'none'
    },
    textarea: {
      padding: '12px 16px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#111827',
      transition: 'all 0.3s',
      outline: 'none',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit'
    },
    select: {
      padding: '12px 16px',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '14px',
      color: '#111827',
      transition: 'all 0.3s',
      outline: 'none',
      cursor: 'pointer',
      backgroundColor: 'white'
    },
    buttonContainer: {
      display: 'flex',
      gap: '16px',
      justifyContent: 'flex-end',
      marginTop: '32px',
      paddingTop: '24px',
      borderTop: '1px solid #E5E7EB'
    },
    cancelButton: {
      padding: '12px 24px',
      backgroundColor: 'white',
      border: '1px solid #D1D5DB',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    submitButton: {
      padding: '12px 32px',
      backgroundColor: '#4F46E5',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    toast: {
      position: 'fixed',
      top: '24px',
      right: '24px',
      padding: '16px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      animation: 'slideIn 0.3s ease-out'
    }
  };

  const toastStyles = {
    success: { backgroundColor: '#10B981', color: 'white' },
    error: { backgroundColor: '#EF4444', color: 'white' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button
          onClick={() => navigate('/teamrep/dashboard')}
          style={styles.backButton}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#F9FAFB';
            e.currentTarget.style.borderColor = '#4F46E5';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#E5E7EB';
          }}
        >
          <FiArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div style={styles.content}>
        <h1 style={styles.title}>Propose New Event</h1>
        <p style={styles.subtitle}>
          Submit your event proposal for faculty approval. Include all relevant details.
        </p>

        <form onSubmit={handleSubmitProposal}>
          <div style={styles.formCard}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
              Event Details
            </h2>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiCalendar size={16} /> Event Name <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={eventData.name}
                  onChange={handleChange}
                  placeholder="e.g., Annual Tech Fest 2024"
                  style={styles.input}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Event Type <span style={styles.required}>*</span>
                </label>
                <select
                  name="type"
                  value={eventData.type}
                  onChange={handleChange}
                  style={styles.select}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                >
                  <option value="">Select Event Type</option>
                  <option value="cultural">Cultural Event</option>
                  <option value="technical">Technical Event</option>
                  <option value="sports">Sports Event</option>
                  <option value="workshop">Workshop/Seminar</option>
                  <option value="competition">Competition</option>
                  <option value="social">Social Initiative</option>
                </select>
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiCalendar size={16} /> Event Date <span style={styles.required}>*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiClock size={16} /> Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={eventData.startTime}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiClock size={16} /> End Time
                </label>
                <input
                  type="time"
                  name="endTime"
                  value={eventData.endTime}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiMapPin size={16} /> Venue <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Main Auditorium"
                  style={styles.input}
                  required
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiDollarSign size={16} /> Budget Required (₹)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={eventData.budget}
                  onChange={handleChange}
                  placeholder="e.g., 50000"
                  style={styles.input}
                  min="0"
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <FiUsers size={16} /> Expected Attendees
                </label>
                <input
                  type="number"
                  name="expectedAttendees"
                  value={eventData.expectedAttendees}
                  onChange={handleChange}
                  placeholder="e.g., 200"
                  style={styles.input}
                  min="0"
                  onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                  onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FiFileText size={16} /> Event Description <span style={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                value={eventData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the event..."
                style={styles.textarea}
                required
                onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FiCheckCircle size={16} /> Event Objectives
              </label>
              <textarea
                name="objectives"
                value={eventData.objectives}
                onChange={handleChange}
                placeholder="What are the key objectives and expected outcomes?"
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                Requirements & Resources
              </label>
              <textarea
                name="requirements"
                value={eventData.requirements}
                onChange={handleChange}
                placeholder="List any special requirements, resources, or permissions needed..."
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#4F46E5'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            <div style={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => navigate('/teamrep/dashboard')}
                style={styles.cancelButton}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={isSubmitting}
                onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#4338CA')}
                onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#4F46E5')}
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <FiSend size={16} /> Submit Proposal
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div style={{ ...styles.toast, ...toastStyles[toast.type] }}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default ProposeEvent;
