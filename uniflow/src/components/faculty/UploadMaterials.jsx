import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiUpload,
  FiFile,
  FiDownload,
  FiTrash2,
  FiBookOpen,
  FiHome,
  FiCalendar,
  FiClock,
  FiLink,
  FiEye,
  FiFolder,
  FiFileText,
  FiImage,
  FiArchive,
  FiX
} from 'react-icons/fi';

const UploadMaterials = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // TODO: Fetch events from API
    // fetchEvents();
  }, []);

  const loadSessions = (eventId) => {
    // TODO: Fetch sessions from API
    // fetchSessions(eventId);
    setSessions([]);
  };

  const loadMaterials = (sessionId) => {
    // TODO: Fetch materials from API
    // fetchMaterials(sessionId);
    setMaterials([]);
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    navigate('/login');
  };

  const handleEventChange = (eventId) => {
    const event = events.find(e => e.id === parseInt(eventId));
    setSelectedEvent(event);
    setSelectedSession(null);
    setMaterials([]);
    if (event) {
      loadSessions(event.id);
    } else {
      setSessions([]);
    }
  };

  const handleSessionChange = (sessionId) => {
    const session = sessions.find(s => s.id === parseInt(sessionId));
    setSelectedSession(session);
    if (session) {
      loadMaterials(session.id);
    } else {
      setMaterials([]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList) => {
    const files = Array.from(fileList);
    
    // Simulate upload with progress
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Add files to materials list
            const newMaterials = files.map((file, index) => ({
              id: materials.length + index + 1,
              sessionId: selectedSession.id,
              fileName: file.name,
              type: file.name.split('.').pop(),
              size: formatFileSize(file.size),
              uploadedOn: new Date().toLocaleString(),
              uploadedBy: 'Current User'
            }));
            
            setMaterials([...materials, ...newMaterials]);
            setIsUploading(false);
            setUploadProgress(0);
            showToast(`${files.length} file(s) uploaded successfully!`, 'success');
            
            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDelete = (materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setMaterials(materials.filter(m => m.id !== materialId));
      showToast('Material deleted successfully!', 'success');
    }
  };

  const getFileIcon = (type) => {
    const lowerType = type.toLowerCase();
    if (['pdf'].includes(lowerType)) return <FiFileText size={20} color="#DC2626" />;
    if (['ppt', 'pptx'].includes(lowerType)) return <FiFileText size={20} color="#EA580C" />;
    if (['doc', 'docx'].includes(lowerType)) return <FiFileText size={20} color="#2563EB" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(lowerType)) return <FiImage size={20} color="#7C3AED" />;
    if (['zip', 'rar'].includes(lowerType)) return <FiArchive size={20} color="#059669" />;
    return <FiFile size={20} color="#6B7280" />;
  };

  return (
    <div style={styles.container}>
      {/* Toast */}
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
            onClick={() => navigate('/faculty/upload-materials')} 
            style={{...styles.navBtn, backgroundColor: '#4F46E5', color: '#FFFFFF', border: 'none'}}
          >
            <FiUpload size={16} /> Upload Materials
          </button>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Upload Session Materials</h1>
            <p style={styles.pageSubtitle}>Upload and manage event-related files like PPTs, PDFs, and notes</p>
          </div>
        </div>

        {/* Event & Session Selection */}
        <div style={styles.selectorsContainer}>
          <div style={styles.selectorGroup}>
            <label style={styles.selectorLabel}>Select Event:</label>
            <select 
              value={selectedEvent?.id || ''} 
              onChange={(e) => handleEventChange(e.target.value)}
              style={styles.select}
              onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
            >
              <option value="">Choose an event...</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.startDate} to {event.endDate})
                </option>
              ))}
            </select>
          </div>

          {selectedEvent && (
            <div style={styles.selectorGroup}>
              <label style={styles.selectorLabel}>Select Session:</label>
              <select 
                value={selectedSession?.id || ''} 
                onChange={(e) => handleSessionChange(e.target.value)}
                style={styles.select}
                onFocus={(e) => e.currentTarget.style.borderColor = '#4F46E5'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
              >
                <option value="">Choose a session...</option>
                {sessions.map(session => (
                  <option key={session.id} value={session.id}>
                    {session.title} - {session.date} at {session.time}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Upload Section */}
        {selectedSession && (
          <div style={{animation: 'fadeIn 0.3s ease-out'}}>
            {/* Session Info */}
            <div style={styles.sessionInfo}>
              <FiCalendar size={18} color="#4F46E5" />
              <span style={{fontSize: '16px', fontWeight: '600', color: '#1F2937'}}>
                {selectedSession.title}
              </span>
              <span style={{fontSize: '14px', color: '#6B7280'}}>•</span>
              <FiClock size={16} color="#6B7280" />
              <span style={{fontSize: '14px', color: '#6B7280'}}>
                {selectedSession.date} at {selectedSession.time}
              </span>
            </div>

            {/* Upload Zone */}
            <div 
              style={{
                ...styles.uploadZone,
                borderColor: dragActive ? '#4F46E5' : '#E5E7EB',
                backgroundColor: dragActive ? '#EEF2FF' : '#F9FAFB'
              }}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{display: 'none'}}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.txt,.jpg,.jpeg,.png"
              />
              <FiUpload size={48} color={dragActive ? '#4F46E5' : '#9CA3AF'} />
              <h3 style={{margin: '16px 0 8px 0', fontSize: '18px', fontWeight: '600', color: '#1F2937'}}>
                {dragActive ? 'Drop files here' : 'Upload Materials'}
              </h3>
              <p style={{margin: '0 0 16px 0', fontSize: '14px', color: '#6B7280'}}>
                Drag and drop files or click to browse
              </p>
              <button 
                onClick={() => fileInputRef.current?.click()}
                style={styles.browseBtn}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4338CA';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#4F46E5';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FiFolder size={16} /> Choose Files
              </button>
              <p style={{margin: '16px 0 0 0', fontSize: '12px', color: '#9CA3AF'}}>
                Supported: PDF, DOC, PPT, Excel, Images, ZIP (Max 50MB per file)
              </p>
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div style={styles.progressContainer}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                  <span style={{fontSize: '14px', color: '#1F2937'}}>Uploading files...</span>
                  <span style={{fontSize: '14px', fontWeight: '600', color: '#4F46E5'}}>{uploadProgress}%</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{...styles.progressFill, width: `${uploadProgress}%`}}></div>
                </div>
              </div>
            )}

            {/* Materials List */}
            <div style={styles.materialsSection}>
              <div style={styles.materialsHeader}>
                <h3 style={{margin: 0, fontSize: '18px', fontWeight: '600', color: '#1F2937'}}>
                  Uploaded Materials ({materials.length})
                </h3>
              </div>

              {materials.length === 0 ? (
                <div style={styles.emptyState}>
                  <FiFile size={48} color="#9CA3AF" />
                  <p style={{margin: '16px 0 0 0', fontSize: '16px', color: '#6B7280'}}>No materials uploaded yet</p>
                  <p style={{margin: '4px 0 0 0', fontSize: '14px', color: '#9CA3AF'}}>Upload files to get started</p>
                </div>
              ) : (
                <div style={styles.materialsList}>
                  {materials.map(material => (
                    <div 
                      key={material.id} 
                      style={styles.materialCard}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateX(4px)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateX(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={styles.materialInfo}>
                        {getFileIcon(material.type)}
                        <div style={{flex: 1}}>
                          <h4 style={styles.materialName}>{material.fileName}</h4>
                          <div style={styles.materialMeta}>
                            <span>{material.size}</span>
                            <span>•</span>
                            <span>{material.uploadedOn}</span>
                            <span>•</span>
                            <span>By {material.uploadedBy}</span>
                          </div>
                        </div>
                      </div>
                      <div style={styles.materialActions}>
                        <button 
                          style={styles.iconBtn}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#DBEAFE';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <FiEye size={18} color="#2563EB" />
                        </button>
                        <button 
                          style={styles.iconBtn}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#D1FAE5';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <FiDownload size={18} color="#059669" />
                        </button>
                        <button 
                          style={styles.iconBtn}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#EEF2FF';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <FiLink size={18} color="#4F46E5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(material.id)}
                          style={styles.iconBtn}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEE2E2';
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <FiTrash2 size={18} color="#DC2626" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
    maxWidth: '1200px',
    margin: '0 auto'
  },
  pageHeader: {
    marginBottom: '24px'
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
  selectorsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  selectorGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  selectorLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  },
  select: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    fontSize: '14px',
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
    outline: 'none',
    transition: 'all 0.2s ease'
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
  sessionInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  uploadZone: {
    backgroundColor: '#F9FAFB',
    border: '2px dashed #E5E7EB',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    marginBottom: '24px',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  browseBtn: {
    padding: '10px 24px',
    backgroundColor: '#4F46E5',
    border: 'none',
    borderRadius: '8px',
    color: '#FFFFFF',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px 20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  progressBar: {
    width: '100%',
    height: '8px',
    backgroundColor: '#E5E7EB',
    borderRadius: '4px',
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    transition: 'width 0.3s ease',
    borderRadius: '4px'
  },
  materialsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  materialsHeader: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E5E7EB'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  materialsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  materialCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    border: '1px solid #E5E7EB',
    transition: 'all 0.2s ease'
  },
  materialInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  materialName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: '500',
    color: '#1F2937'
  },
  materialMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '4px'
  },
  materialActions: {
    display: 'flex',
    gap: '8px'
  },
  iconBtn: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

export default UploadMaterials;
