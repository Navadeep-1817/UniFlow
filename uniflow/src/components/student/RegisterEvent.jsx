import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiUser, FiUsers, FiMail, FiPhone, FiCalendar, FiCheck, FiX, FiArrowRight, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { colors, commonStyles, hoverEffects } from '../../styles/globalStyles';

const RegisterEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrationType, setRegistrationType] = useState('individual');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  
  const [formData, setFormData] = useState({
    studentName: 'Rajesh Kumar',
    rollNumber: 'CS2021001',
    email: 'rajesh.kumar@university.edu',
    phone: '+91 9876543210',
    department: 'Computer Science',
    year: '4th Year',
    teamName: '',
    teamMembers: [
      { name: '', rollNumber: '', email: '', phone: '' }
    ],
    specialRequirements: '',
    agreeToTerms: false
  });

  useEffect(() => {
    // Mock event data - in real app, fetch from API using eventId
    setEvent({
      id: eventId || 1,
      name: 'Annual Tech Fest 2024',
      type: 'both', // individual, team, or both
      description: 'A comprehensive technical festival featuring coding competitions, workshops, and tech talks',
      date: '2024-11-15',
      venue: 'Main Auditorium',
      maxTeamSize: 4,
      minTeamSize: 2,
      registrationDeadline: '2024-11-10',
      fee: 500,
      category: 'Technical',
      organizer: 'CSE Department'
    });
  }, [eventId]);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
    setFormData(prev => ({ ...prev, teamMembers: updatedMembers }));
  };

  const addTeamMember = () => {
    if (formData.teamMembers.length < event.maxTeamSize) {
      setFormData(prev => ({
        ...prev,
        teamMembers: [...prev.teamMembers, { name: '', rollNumber: '', email: '', phone: '' }]
      }));
    }
  };

  const removeTeamMember = (index) => {
    if (formData.teamMembers.length > event.minTeamSize) {
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    if (!formData.agreeToTerms) {
      showToast('Please agree to terms and conditions', 'error');
      return false;
    }

    if (registrationType === 'team') {
      if (!formData.teamName.trim()) {
        showToast('Team name is required', 'error');
        return false;
      }
      if (formData.teamMembers.length < event.minTeamSize) {
        showToast(`Minimum ${event.minTeamSize} team members required`, 'error');
        return false;
      }
      for (let member of formData.teamMembers) {
        if (!member.name || !member.rollNumber) {
          showToast('All team members must have name and roll number', 'error');
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowConfirmation(true);
      showToast('Registration successful!');
    }, 1500);
  };

  const handleGoToDashboard = () => {
    navigate('/student/dashboard');
  };

  const handleViewRegistrations = () => {
    navigate('/student/my-registrations');
  };

  if (!event) {
    return (
      <div style={commonStyles.container}>
        <div style={commonStyles.content}>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ color: colors.gray500 }}>Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (showConfirmation) {
    return (
      <div style={commonStyles.container}>
        <div style={commonStyles.content}>
          <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
            <div style={commonStyles.card}>
              <div style={{ padding: '40px 20px' }}>
                <div style={{ width: '80px', height: '80px', margin: '0 auto 24px', backgroundColor: colors.successLight, 
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FiCheckCircle size={48} color={colors.success} />
                </div>
                <h2 style={{ fontSize: '28px', fontWeight: '700', color: colors.gray800, margin: '0 0 12px 0' }}>
                  Registration Successful!
                </h2>
                <p style={{ fontSize: '16px', color: colors.gray600, margin: '0 0 24px 0', lineHeight: '1.6' }}>
                  You have successfully registered for <strong>{event.name}</strong>
                  {registrationType === 'team' && ` as team "${formData.teamName}"`}.
                </p>
                
                <div style={{ padding: '20px', backgroundColor: colors.infoLight, borderRadius: '10px', marginBottom: '24px', textAlign: 'left' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.infoDark, margin: '0 0 12px 0' }}>
                    What's Next?
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: colors.gray700, fontSize: '14px', lineHeight: '1.8' }}>
                    <li>Check your email for confirmation and event details</li>
                    <li>Payment instructions will be sent if applicable</li>
                    <li>View your registration status in "My Registrations"</li>
                    <li>You will receive reminders before the event</li>
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={handleGoToDashboard} style={commonStyles.secondaryBtn}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.gray200; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.gray100; }}>
                    Go to Dashboard
                  </button>
                  <button onClick={handleViewRegistrations} style={commonStyles.primaryBtn}
                    onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                    View My Registrations <FiArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={commonStyles.container}>
      {toast.show && (
        <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>
          {toast.message}
        </div>
      )}

      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Event Registration</h1>
            <p style={commonStyles.pageSubtitle}>Complete the form below to register for the event</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Registration Form */}
          <div>
            <form onSubmit={handleSubmit}>
              {/* Event Details Card */}
              <div style={{ ...commonStyles.card, marginBottom: '24px', backgroundColor: colors.primaryLight }}>
                <h3 style={{ fontSize: '22px', fontWeight: '700', color: colors.primary, margin: '0 0 8px 0' }}>
                  {event.name}
                </h3>
                <p style={{ fontSize: '14px', color: colors.gray700, margin: '0 0 16px 0' }}>
                  {event.description}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                  <div><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
                  <div><strong>Venue:</strong> {event.venue}</div>
                  <div><strong>Category:</strong> {event.category}</div>
                  <div><strong>Fee:</strong> ₹{event.fee}</div>
                </div>
              </div>

              {/* Registration Type Selection */}
              {event.type === 'both' && (
                <div style={{ ...commonStyles.card, marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 16px 0' }}>
                    Registration Type
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="button" onClick={() => setRegistrationType('individual')}
                      style={{ flex: 1, padding: '16px', backgroundColor: registrationType === 'individual' ? colors.primary : colors.white,
                        color: registrationType === 'individual' ? colors.white : colors.gray700, border: `2px solid ${colors.primary}`,
                        borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { if (registrationType !== 'individual') e.currentTarget.style.backgroundColor = colors.primaryLight; }}
                      onMouseLeave={(e) => { if (registrationType !== 'individual') e.currentTarget.style.backgroundColor = colors.white; }}>
                      <FiUser size={20} /> Individual
                    </button>
                    <button type="button" onClick={() => setRegistrationType('team')}
                      style={{ flex: 1, padding: '16px', backgroundColor: registrationType === 'team' ? colors.primary : colors.white,
                        color: registrationType === 'team' ? colors.white : colors.gray700, border: `2px solid ${colors.primary}`,
                        borderRadius: '10px', cursor: 'pointer', fontSize: '15px', fontWeight: '600', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { if (registrationType !== 'team') e.currentTarget.style.backgroundColor = colors.primaryLight; }}
                      onMouseLeave={(e) => { if (registrationType !== 'team') e.currentTarget.style.backgroundColor = colors.white; }}>
                      <FiUsers size={20} /> Team
                    </button>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div style={{ ...commonStyles.card, marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', 
                  paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>
                  Your Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>
                      Full Name *
                    </label>
                    <input type="text" value={formData.studentName} readOnly
                      style={{ ...commonStyles.input, backgroundColor: colors.gray100 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>
                      Roll Number *
                    </label>
                    <input type="text" value={formData.rollNumber} readOnly
                      style={{ ...commonStyles.input, backgroundColor: colors.gray100 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>
                      Department *
                    </label>
                    <input type="text" value={formData.department} readOnly
                      style={{ ...commonStyles.input, backgroundColor: colors.gray100 }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>
                      Email *
                    </label>
                    <input type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)}
                      required style={commonStyles.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>
                      Phone Number *
                    </label>
                    <input type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)}
                      required style={commonStyles.input} />
                  </div>
                </div>
              </div>

              {/* Team Information */}
              {registrationType === 'team' && (
                <div style={{ ...commonStyles.card, marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', 
                    paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: 0 }}>
                      Team Information
                    </h3>
                    <span style={{ fontSize: '13px', color: colors.gray500 }}>
                      {formData.teamMembers.length}/{event.maxTeamSize} members
                    </span>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>
                      Team Name *
                    </label>
                    <input type="text" value={formData.teamName} onChange={(e) => handleInputChange('teamName', e.target.value)}
                      placeholder="Enter team name" required={registrationType === 'team'} style={commonStyles.input} />
                  </div>

                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: colors.gray700, margin: '0 0 16px 0' }}>
                    Team Members (including you)
                  </h4>

                  {formData.teamMembers.map((member, index) => (
                    <div key={index} style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '10px', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h5 style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, margin: 0 }}>
                          Member {index + 1}
                        </h5>
                        {index >= event.minTeamSize && (
                          <button type="button" onClick={() => removeTeamMember(index)}
                            style={{ padding: '6px', backgroundColor: colors.errorLight, border: 'none', borderRadius: '6px',
                              color: colors.error, cursor: 'pointer', transition: 'all 0.2s ease' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.error; e.currentTarget.style.color = colors.white; }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.errorLight; e.currentTarget.style.color = colors.error; }}>
                            <FiX size={16} />
                          </button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                        <div>
                          <input type="text" value={member.name} onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                            placeholder="Full Name *" required={registrationType === 'team'} style={commonStyles.input} />
                        </div>
                        <div>
                          <input type="text" value={member.rollNumber} onChange={(e) => handleTeamMemberChange(index, 'rollNumber', e.target.value)}
                            placeholder="Roll Number *" required={registrationType === 'team'} style={commonStyles.input} />
                        </div>
                        <div>
                          <input type="email" value={member.email} onChange={(e) => handleTeamMemberChange(index, 'email', e.target.value)}
                            placeholder="Email" style={commonStyles.input} />
                        </div>
                        <div>
                          <input type="tel" value={member.phone} onChange={(e) => handleTeamMemberChange(index, 'phone', e.target.value)}
                            placeholder="Phone" style={commonStyles.input} />
                        </div>
                      </div>
                    </div>
                  ))}

                  {formData.teamMembers.length < event.maxTeamSize && (
                    <button type="button" onClick={addTeamMember}
                      style={{ width: '100%', padding: '12px', backgroundColor: colors.primaryLight, border: `2px dashed ${colors.primary}`,
                        borderRadius: '8px', color: colors.primary, cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.color = colors.white; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primaryLight; e.currentTarget.style.color = colors.primary; }}>
                      <FiUsers size={16} /> Add Team Member
                    </button>
                  )}
                </div>
              )}

              {/* Additional Information */}
              <div style={{ ...commonStyles.card, marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 16px 0' }}>
                  Additional Information
                </h3>
                <textarea value={formData.specialRequirements} onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  placeholder="Any special requirements or dietary restrictions?"
                  style={{ ...commonStyles.input, minHeight: '100px', resize: 'vertical' }} />
              </div>

              {/* Terms and Conditions */}
              <div style={{ ...commonStyles.card, marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'start', gap: '12px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.agreeToTerms} onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    style={{ marginTop: '4px', cursor: 'pointer' }} />
                  <span style={{ fontSize: '14px', color: colors.gray700, lineHeight: '1.6' }}>
                    I agree to the terms and conditions. I understand that attendance is mandatory and I will abide by the event rules and regulations.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={isSubmitting}
                style={{ ...commonStyles.primaryBtn, width: '100%', padding: '16px', fontSize: '16px', fontWeight: '600' }}
                onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                {isSubmitting ? 'Submitting...' : 'Complete Registration'}
              </button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div>
            <div style={{ position: 'sticky', top: '20px' }}>
              <div style={commonStyles.card}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: colors.gray800, margin: '0 0 20px 0', 
                  paddingBottom: '16px', borderBottom: `2px solid ${colors.gray200}` }}>
                  Registration Summary
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Event</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800 }}>{event.name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Registration Type</div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: colors.primary, textTransform: 'capitalize' }}>
                      {registrationType}
                    </div>
                  </div>
                  {registrationType === 'team' && formData.teamName && (
                    <div>
                      <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Team Name</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800 }}>{formData.teamName}</div>
                    </div>
                  )}
                  {registrationType === 'team' && (
                    <div>
                      <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Team Size</div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800 }}>
                        {formData.teamMembers.length} member{formData.teamMembers.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px', backgroundColor: colors.warningLight, borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: colors.warningDark, marginBottom: '4px' }}>Registration Fee</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: colors.warning }}>₹{event.fee}</div>
                  {registrationType === 'team' && (
                    <div style={{ fontSize: '11px', color: colors.warningDark, marginTop: '4px' }}>
                      ₹{event.fee} × {formData.teamMembers.length} = ₹{event.fee * formData.teamMembers.length}
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px', backgroundColor: colors.infoLight, borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <FiAlertCircle size={16} color={colors.info} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: colors.infoDark }}>Important</span>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: colors.gray700, lineHeight: '1.6' }}>
                    <li>Payment details will be sent via email</li>
                    <li>Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}</li>
                    <li>Attendance is mandatory</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvent;
