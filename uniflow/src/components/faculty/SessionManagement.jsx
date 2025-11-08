import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiUsers, 
  FiBookOpen,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiUpload,
  FiFile,
  FiCheckCircle,
  FiHome,
  FiMessageSquare,
  FiLink,
  FiSave
} from 'react-icons/fi';

const SessionManagement = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMaterialsModal, setShowMaterialsModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const fileInputRef = React.useRef(null);
  
  const [formData, setFormData] = useState({
    eventName: '',
    sessionTitle: '',
    topic: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    description: '',
    objectives: '',
    materials: [],
    feedbackEnabled: true
  });

  useEffect(() => {
    // TODO: Fetch sessions from API
    // fetchSessions();
  }, []);

  useEffect(() => {
    if (selectedEvent === 'all') {
      setFilteredSessions(sessions);
    } else {
      setFilteredSessions(sessions.filter(s => s.eventId === parseInt(selectedEvent)));
    }
  }, [selectedEvent, sessions]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    const newSession = {
      id: sessions.length + 1,
      ...formData,
      eventId: 1,
      status: 'scheduled',
      participants: 0,
      materials: [],
      feedbackCollected: 0
    };
    setSessions([...sessions, newSession]);
    setShowCreateModal(false);
    resetForm();
    showToast('Session created successfully!', 'success');
  };

  const handleEditSession = (e) => {
    e.preventDefault();
    const updatedSessions = sessions.map(s => 
      s.id === selectedSession.id ? { ...s, ...formData } : s
    );
    setSessions(updatedSessions);
    setShowEditModal(false);
    setSelectedSession(null);
    resetForm();
    showToast('Session updated successfully!', 'success');
  };

  const handleDeleteSession = (sessionId) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      setSessions(sessions.filter(s => s.id !== sessionId));
      showToast('Session deleted successfully!', 'success');
    }
  };

  const resetForm = () => {
    setFormData({
      eventName: '',
      sessionTitle: '',
      topic: '',
      date: '',
      startTime: '',
      endTime: '',
      venue: '',
      description: '',
      objectives: '',
      materials: [],
      feedbackEnabled: true
    });
  };

  const openEditModal = (session) => {
    setSelectedSession(session);
    setFormData({
      eventName: session.eventName,
      sessionTitle: session.sessionTitle,
      topic: session.topic,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      venue: session.venue,
      description: session.description,
      objectives: session.objectives,
      materials: session.materials,
      feedbackEnabled: session.feedbackEnabled
    });
    setShowEditModal(true);
  };

  const openMaterialsModal = (session) => {
    setSelectedSession(session);
    setShowMaterialsModal(true);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Process each selected file
    const newMaterials = files.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      type: file.name.split('.').pop(),
      size: formatFileSize(file.size),
      file: file
    }));

    // Update the session materials
    const updatedSessions = sessions.map(s => {
      if (s.id === selectedSession.id) {
        return {
          ...s,
          materials: [...s.materials, ...newMaterials]
        };
      }
      return s;
    });

    setSessions(updatedSessions);
    setSelectedSession({
      ...selectedSession,
      materials: [...selectedSession.materials, ...newMaterials]
    });

    showToast(`${files.length} file(s) uploaded successfully!`, 'success');
    e.target.value = ''; // Reset input
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDeleteMaterial = (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const updatedSessions = sessions.map(s => {
        if (s.id === selectedSession.id) {
          return {
            ...s,
            materials: s.materials.filter(m => m.id !== materialId)
          };
        }
        return s;
      });

      setSessions(updatedSessions);
      setSelectedSession({
        ...selectedSession,
        materials: selectedSession.materials.filter(m => m.id !== materialId)
      });

      showToast('Material deleted successfully!', 'success');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: { bg: '#DBEAFE', color: '#1E40AF' },
      ongoing: { bg: '#FEF3C7', color: '#92400E' },
      completed: { bg: '#D1FAE5', color: '#065F46' },
      cancelled: { bg: '#FEE2E2', color: '#991B1B' }
    };
    return colors[status] || colors.scheduled;
  };

  return (
    <div style={styles.container}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#10B981' : toast.type === 'error' ? '#EF4444' : '#3B82F6'
        }}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <FiBookOpen size={28} />
          UniFlow Faculty
        </div>
        <div style={styles.nav}>
          <button onClick={() => navigate('/faculty/dashboard')} style={styles.navBtn}>
            <FiHome size={16} /> Dashboard
          </button>
          <button 
            onClick={() => navigate('/faculty/sessions')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiCalendar size={16} /> Sessions
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Session Management</h1>
            <p style={styles.pageSubtitle}>Create and manage your event sessions</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            style={styles.createBtn}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#4338CA';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#4F46E5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(79, 70, 229, 0.2)';
            }}
          >
            <FiPlus size={20} /> Create New Session
          </button>
        </div>

        {/* Filter Section */}
        <div style={styles.filterSection}>
          <label style={styles.filterLabel}>Filter by Event:</label>
          <select 
            value={selectedEvent} 
            onChange={(e) => setSelectedEvent(e.target.value)}
            style={styles.select}
            onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
            onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
          >
            <option value="all">All Events</option>
            <option value="1">AI & ML Workshop</option>
            <option value="2">Web Development SDP</option>
          </select>
          <span style={styles.countBadge}>
            {filteredSessions.length} {filteredSessions.length === 1 ? 'Session' : 'Sessions'}
          </span>
        </div>

        {/* Sessions Grid */}
        <div style={styles.sessionsGrid}>
          {filteredSessions.length === 0 ? (
            <div style={styles.emptyState}>
              <FiCalendar size={48} color="#9CA3AF" />
              <h3 style={{color: '#6B7280', fontSize: '18px', marginTop: '16px'}}>No sessions found</h3>
              <p style={{color: '#9CA3AF', fontSize: '14px'}}>Create your first session to get started</p>
            </div>
          ) : (
            filteredSessions.map(session => {
              const statusStyle = getStatusColor(session.status);
              const duration = `${session.startTime} - ${session.endTime}`;
              
              return (
                <div 
                  key={session.id} 
                  style={styles.sessionCard}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                    e.currentTarget.style.borderColor = '#C7D2FE';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = 'transparent';
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={{flex: 1}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px'}}>
                        <span style={{fontSize: '13px', color: '#6B7280', fontWeight: '500'}}>{session.eventName}</span>
                      </div>
                      <h3 style={styles.sessionTitle}>{session.sessionTitle}</h3>
                      <p style={styles.sessionTopic}>{session.topic}</p>
                    </div>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: statusStyle.bg,
                      color: statusStyle.color
                    }}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>

                  <div style={styles.sessionDetails}>
                    <div style={styles.detailItem}>
                      <FiCalendar size={16} color="#6B7280" />
                      <span>{new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <FiClock size={16} color="#6B7280" />
                      <span>{duration}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <FiMapPin size={16} color="#6B7280" />
                      <span>{session.venue}</span>
                    </div>
                    <div style={styles.detailItem}>
                      <FiUsers size={16} color="#6B7280" />
                      <span>{session.participants} Participants</span>
                    </div>
                  </div>

                  <div style={styles.sessionMeta}>
                    <div style={styles.metaItem}>
                      <FiFile size={14} />
                      <span>{session.materials.length} Materials</span>
                    </div>
                    <div style={styles.metaItem}>
                      <FiMessageSquare size={14} />
                      <span>Feedback: {session.feedbackEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>

                  <div style={styles.cardActions}>
                    <button 
                      onClick={() => openEditModal(session)}
                      style={styles.actionButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E0E7FF';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#EEF2FF';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FiEdit size={16} /> Edit
                    </button>
                    <button 
                      onClick={() => openMaterialsModal(session)}
                      style={{...styles.actionButton, backgroundColor: '#D1FAE5', color: '#065F46'}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#A7F3D0';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#D1FAE5';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FiUpload size={16} /> Materials
                    </button>
                    <button 
                      onClick={() => handleDeleteSession(session.id)}
                      style={{...styles.actionButton, backgroundColor: '#FEE2E2', color: '#991B1B'}}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#FCA5A5';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEE2E2';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Create/Edit Session Modal */}
        {(showCreateModal || showEditModal) && (
          <div style={styles.modalOverlay} onClick={() => {setShowCreateModal(false); setShowEditModal(false); resetForm();}}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>
                  {showEditModal ? 'Edit Session' : 'Create New Session'}
                </h2>
                <button 
                  onClick={() => {setShowCreateModal(false); setShowEditModal(false); resetForm();}}
                  style={styles.closeBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={showEditModal ? handleEditSession : handleCreateSession} style={styles.modalBody}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Event Name *</label>
                    <input
                      type="text"
                      name="eventName"
                      value={formData.eventName}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                      placeholder="e.g., AI & ML Workshop"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Session Title *</label>
                    <input
                      type="text"
                      name="sessionTitle"
                      value={formData.sessionTitle}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                      placeholder="e.g., Introduction to ML"
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Topic *</label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    placeholder="e.g., ML Fundamentals & Algorithms"
                  />
                </div>

                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Start Time *</label>
                    <input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>End Time *</label>
                    <input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      required
                      style={styles.input}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Venue *</label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    placeholder="e.g., Lab 301, Auditorium"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    style={{...styles.input, resize: 'vertical'}}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    placeholder="Brief description of the session"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Learning Objectives</label>
                  <textarea
                    name="objectives"
                    value={formData.objectives}
                    onChange={handleInputChange}
                    rows={3}
                    style={{...styles.input, resize: 'vertical'}}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                    placeholder="What participants will learn"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={{...styles.label, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                    <input
                      type="checkbox"
                      name="feedbackEnabled"
                      checked={formData.feedbackEnabled}
                      onChange={handleInputChange}
                      style={{width: '18px', height: '18px', cursor: 'pointer'}}
                    />
                    Enable Feedback Collection
                  </label>
                </div>

                <div style={{display: 'flex', gap: '12px', marginTop: '24px'}}>
                  <button 
                    type="submit"
                    style={styles.submitBtn}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#4338CA';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#4F46E5';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FiSave size={16} /> {showEditModal ? 'Update Session' : 'Create Session'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {setShowCreateModal(false); setShowEditModal(false); resetForm();}}
                    style={styles.cancelBtn}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E5E7EB';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F3F4F6';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Materials Modal */}
        {showMaterialsModal && selectedSession && (
          <div style={styles.modalOverlay} onClick={() => {setShowMaterialsModal(false); setSelectedSession(null);}}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={{margin: 0, fontSize: '24px', fontWeight: '600', color: '#1F2937'}}>Session Materials</h2>
                <button 
                  onClick={() => {setShowMaterialsModal(false); setSelectedSession(null);}}
                  style={styles.closeBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F3F4F6';
                    e.currentTarget.style.transform = 'rotate(90deg)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.transform = 'rotate(0deg)';
                  }}
                >
                  <FiX size={24} />
                </button>
              </div>
              <div style={styles.modalBody}>
                <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '8px'}}>{selectedSession.sessionTitle}</h3>
                <p style={{color: '#6B7280', fontSize: '14px', marginBottom: '24px'}}>{selectedSession.eventName}</p>
                
                <div style={{marginBottom: '24px'}}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{display: 'none'}}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt,.jpg,.jpeg,.png"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    style={styles.uploadBtn}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#E0E7FF';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#EEF2FF';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <FiUpload size={18} /> Upload Material
                  </button>
                  <p style={{fontSize: '12px', color: '#6B7280', marginTop: '8px'}}>Supports: PDF, DOC, PPT, Excel, Images, ZIP files</p>
                </div>

                {selectedSession.materials.length === 0 ? (
                  <div style={{textAlign: 'center', padding: '40px', backgroundColor: '#F9FAFB', borderRadius: '8px'}}>
                    <FiFile size={40} color="#9CA3AF" />
                    <p style={{color: '#6B7280', marginTop: '12px'}}>No materials uploaded yet</p>
                  </div>
                ) : (
                  <div style={{display: 'grid', gap: '12px'}}>
                    {selectedSession.materials.map(material => (
                      <div 
                        key={material.id} 
                        style={styles.materialItem}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                      >
                        <div style={{display: 'flex', alignItems: 'center', gap: '12px', flex: 1}}>
                          <FiFile size={20} color="#4F46E5" />
                          <div>
                            <p style={{margin: 0, fontSize: '14px', fontWeight: '500', color: '#1F2937'}}>{material.name}</p>
                            <p style={{margin: 0, fontSize: '12px', color: '#6B7280'}}>{material.size}</p>
                          </div>
                        </div>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button 
                            style={styles.iconBtn}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EEF2FF'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <FiLink size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteMaterial(material.id)}
                            style={{...styles.iconBtn, color: '#DC2626'}}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#F9FAFB',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E5E7EB',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  logo: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  nav: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  navBtn: {
    padding: '10px 16px',
    backgroundColor: 'transparent',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    color: '#6B7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s'
  },
  logoutBtn: {
    padding: '10px 16px',
    backgroundColor: '#FEE2E2',
    border: 'none',
    borderRadius: '8px',
    color: '#DC2626',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  mainContent: {
    padding: '24px',
    maxWidth: '1400px',
    margin: '0 auto'
  },
  pageHeader: {
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px'
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0
  },
  pageSubtitle: {
    fontSize: '16px',
    color: '#6B7280',
    margin: '8px 0 0 0'
  },
  createBtn: {
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '10px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)'
  },
  filterSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    flexWrap: 'wrap'
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  select: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  countBadge: {
    padding: '6px 16px',
    backgroundColor: '#EEF2FF',
    color: '#4F46E5',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600'
  },
  sessionsGrid: {
    display: 'grid',
    gap: '20px'
  },
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontWeight: '500',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    animation: 'slideInRight 0.3s ease-out'
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid transparent'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: '16px'
  },
  sessionTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: '4px'
  },
  sessionTopic: {
    margin: 0,
    fontSize: '14px',
    color: '#6B7280'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    whiteSpace: 'nowrap'
  },
  sessionDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    marginBottom: '16px'
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6B7280'
  },
  sessionMeta: {
    display: 'flex',
    gap: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E5E7EB'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#6B7280'
  },
  cardActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px'
  },
  actionButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#EEF2FF',
    border: 'none',
    borderRadius: '8px',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  modalHeader: {
    padding: '24px',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 10
  },
  modalBody: {
    padding: '24px'
  },
  closeBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    color: '#6B7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '16px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    outline: 'none',
    transition: 'all 0.2s ease'
  },
  submitBtn: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  cancelBtn: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  uploadBtn: {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#EEF2FF',
    border: '2px dashed #4F46E5',
    borderRadius: '8px',
    color: '#4F46E5',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  materialItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#FFFFFF',
    border: '1px solid #E5E7EB',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  },
  iconBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#6B7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  }
};

export default SessionManagement;
