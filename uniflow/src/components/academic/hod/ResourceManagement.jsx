import React, { useState, useEffect } from 'react';
import HODTopNav from './HODTopNav';
import { 
  FiPackage,
  FiMonitor,
  FiTool,
  FiHome,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiSave,
  FiFilter,
  FiSearch,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin
} from 'react-icons/fi';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const [formData, setFormData] = useState({
    name: '',
    type: 'lab',
    capacity: '',
    location: '',
    description: '',
    status: 'available'
  });

  const [bookingData, setBookingData] = useState({
    resourceId: '',
    purpose: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    bookedBy: ''
  });

  useEffect(() => {
    const mockResources = [
      { id: 1, name: 'Computer Lab 1', type: 'lab', capacity: 60, location: 'Block A - Floor 2', description: 'High-spec computers with software', status: 'available' },
      { id: 2, name: 'Conference Hall A', type: 'classroom', capacity: 100, location: 'Block B - Floor 1', description: 'Large hall with AC and projector', status: 'available' },
      { id: 3, name: 'Smart Classroom 301', type: 'classroom', capacity: 40, location: 'Block A - Floor 3', description: 'Interactive whiteboard', status: 'available' },
      { id: 4, name: 'Projector Unit 5', type: 'equipment', capacity: 1, location: 'Equipment Room', description: 'HD Projector with HDMI', status: 'available' },
      { id: 5, name: 'Laptop Set (10 units)', type: 'equipment', capacity: 10, location: 'IT Store', description: 'Dell Laptops for workshops', status: 'available' },
      { id: 6, name: 'AI/ML Lab', type: 'lab', capacity: 50, location: 'Block C - Floor 2', description: 'GPU-enabled workstations', status: 'maintenance' }
    ];

    const mockBookings = [
      { id: 1, resourceId: 1, resourceName: 'Computer Lab 1', purpose: 'Python Programming Workshop', date: '2024-11-25', startTime: '10:00', endTime: '12:00', bookedBy: 'Dr. Priya Sharma' },
      { id: 2, resourceId: 2, resourceName: 'Conference Hall A', purpose: 'AI/ML Seminar', date: '2024-11-26', startTime: '09:00', endTime: '11:00', bookedBy: 'Prof. Rajesh Kumar' },
      { id: 3, resourceId: 4, resourceName: 'Projector Unit 5', purpose: 'Guest Lecture', date: '2024-11-25', startTime: '14:00', endTime: '16:00', bookedBy: 'Dr. Anita Desai' }
    ];

    setResources(mockResources);
    setBookings(mockBookings);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleBookingChange = (e) => {
    setBookingData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    const newResource = { id: Date.now(), ...formData };
    setResources([...resources, newResource]);
    showToast('Resource added successfully!');
    setShowAddModal(false);
    setFormData({ name: '', type: 'lab', capacity: '', location: '', description: '', status: 'available' });
  };

  const handleEditResource = (e) => {
    e.preventDefault();
    setResources(resources.map(r => r.id === editingResource.id ? { ...r, ...formData } : r));
    showToast('Resource updated successfully!');
    setShowEditModal(false);
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Delete this resource?')) {
      setResources(resources.filter(r => r.id !== id));
      setBookings(bookings.filter(b => b.resourceId !== id));
      showToast('Resource deleted!');
    }
  };

  const handleBookResource = (e) => {
    e.preventDefault();
    const resource = resources.find(r => r.id === bookingData.resourceId);
    const conflict = bookings.find(b => 
      b.resourceId === bookingData.resourceId && 
      b.date === bookingData.date &&
      ((bookingData.startTime >= b.startTime && bookingData.startTime < b.endTime) ||
       (bookingData.endTime > b.startTime && bookingData.endTime <= b.endTime))
    );

    if (conflict) {
      showToast('Booking conflict! Resource already booked for this time.', 'error');
      return;
    }

    const newBooking = {
      id: Date.now(),
      ...bookingData,
      resourceName: resource.name
    };
    setBookings([...bookings, newBooking]);
    showToast('Resource booked successfully!');
    setShowBookModal(false);
  };

  const handleCancelBooking = (id) => {
    if (window.confirm('Cancel this booking?')) {
      setBookings(bookings.filter(b => b.id !== id));
      showToast('Booking cancelled!');
    }
  };

  const openEditModal = (resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      location: resource.location,
      description: resource.description,
      status: resource.status
    });
    setShowEditModal(true);
  };

  const openBookModal = (resource) => {
    setSelectedResource(resource);
    setBookingData({
      resourceId: resource.id,
      purpose: '',
      date: '',
      startTime: '09:00',
      endTime: '10:00',
      bookedBy: ''
    });
    setShowBookModal(true);
  };

  const getResourceIcon = (type) => {
    switch(type) {
      case 'lab': return <FiMonitor size={20} />;
      case 'classroom': return <FiHome size={20} />;
      case 'equipment': return <FiTool size={20} />;
      default: return <FiPackage size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return { bg: '#D1FAE5', color: '#065F46' };
      case 'booked': return { bg: '#FEF3C7', color: '#92400E' };
      case 'maintenance': return { bg: '#FEE2E2', color: '#991B1B' };
      default: return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div style={styles.container}>
      <HODTopNav />
      
      {toast.show && (
        <div style={{...styles.toast, backgroundColor: toast.type === 'success' ? '#10B981' : '#EF4444'}}>
          {toast.message}
        </div>
      )}

      <div style={styles.content}>
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>Resource Management</h1>
            <p style={styles.pageSubtitle}>Track and allocate departmental resources</p>
          </div>
          <button onClick={() => setShowAddModal(true)} style={styles.addBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
            <FiPlus size={18} /> Add Resource
          </button>
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIcon, backgroundColor: '#EEF2FF'}}>
              <FiPackage size={24} color="#4F46E5" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{resources.length}</div>
              <div style={styles.statLabel}>Total Resources</div>
            </div>
          </div>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIcon, backgroundColor: '#D1FAE5'}}>
              <FiCheckCircle size={24} color="#10B981" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{resources.filter(r => r.status === 'available').length}</div>
              <div style={styles.statLabel}>Available</div>
            </div>
          </div>
          <div style={styles.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
            <div style={{...styles.statIcon, backgroundColor: '#FEF3C7'}}>
              <FiCalendar size={24} color="#F59E0B" />
            </div>
            <div style={styles.statContent}>
              <div style={styles.statValue}>{bookings.length}</div>
              <div style={styles.statLabel}>Active Bookings</div>
            </div>
          </div>
        </div>

        <div style={styles.controlsBar}>
          <div style={styles.searchBox}>
            <FiSearch size={18} color="#6B7280" />
            <input type="text" placeholder="Search resources..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={styles.searchInput} />
          </div>
          <div style={styles.filterGroup}>
            <FiFilter size={16} color="#6B7280" />
            <span style={{fontSize: '14px', fontWeight: '600'}}>Type:</span>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={styles.filterSelect}>
              <option value="all">All</option>
              <option value="lab">Labs</option>
              <option value="classroom">Classrooms</option>
              <option value="equipment">Equipment</option>
            </select>
            <span style={{fontSize: '14px', fontWeight: '600'}}>Status:</span>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={styles.filterSelect}>
              <option value="all">All</option>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div style={styles.resourcesGrid}>
          {filteredResources.map(resource => {
            const statusColor = getStatusColor(resource.status);
            const resourceBookings = bookings.filter(b => b.resourceId === resource.id);
            return (
              <div key={resource.id} style={styles.resourceCard} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'; }}>
                <div style={styles.resourceHeader}>
                  <div style={{...styles.resourceIcon, backgroundColor: resource.type === 'lab' ? '#EEF2FF' : resource.type === 'classroom' ? '#D1FAE5' : '#FEF3C7', color: resource.type === 'lab' ? '#4F46E5' : resource.type === 'classroom' ? '#10B981' : '#F59E0B'}}>
                    {getResourceIcon(resource.type)}
                  </div>
                  <div style={{...styles.statusBadge, backgroundColor: statusColor.bg, color: statusColor.color}}>
                    {resource.status}
                  </div>
                </div>
                <h3 style={styles.resourceName}>{resource.name}</h3>
                <div style={styles.resourceMeta}>
                  <div style={styles.metaItem}>
                    <FiMapPin size={14} color="#6B7280" />
                    <span>{resource.location}</span>
                  </div>
                  <div style={styles.metaItem}>
                    <FiPackage size={14} color="#6B7280" />
                    <span>Capacity: {resource.capacity}</span>
                  </div>
                </div>
                <p style={styles.resourceDesc}>{resource.description}</p>
                {resourceBookings.length > 0 && (
                  <div style={styles.bookingInfo}>
                    <FiCalendar size={14} color="#F59E0B" />
                    <span>{resourceBookings.length} upcoming booking{resourceBookings.length > 1 ? 's' : ''}</span>
                  </div>
                )}
                <div style={styles.resourceActions}>
                  <button onClick={() => openBookModal(resource)} disabled={resource.status !== 'available'} style={{...styles.bookBtn, opacity: resource.status !== 'available' ? 0.5 : 1, cursor: resource.status !== 'available' ? 'not-allowed' : 'pointer'}} onMouseEnter={(e) => { if(resource.status === 'available') { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }}} onMouseLeave={(e) => { if(resource.status === 'available') { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}}>
                    <FiCalendar size={14} /> Book
                  </button>
                  <button onClick={() => openEditModal(resource)} style={styles.editBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#DBEAFE'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiEdit size={14} />
                  </button>
                  <button onClick={() => handleDeleteResource(resource.id)} style={styles.deleteBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.bookingsSection}>
          <h3 style={styles.sectionTitle}><FiCalendar size={18} /> Active Bookings ({bookings.length})</h3>
          {bookings.length === 0 ? (
            <div style={styles.emptyState}>
              <FiCalendar size={48} color="#9CA3AF" />
              <p>No bookings yet</p>
            </div>
          ) : (
            <div style={styles.bookingsList}>
              {bookings.map(booking => (
                <div key={booking.id} style={styles.bookingCard} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFF'; }}>
                  <div style={styles.bookingHeader}>
                    <div>
                      <div style={styles.bookingResource}>{booking.resourceName}</div>
                      <div style={styles.bookingPurpose}>{booking.purpose}</div>
                    </div>
                    <button onClick={() => handleCancelBooking(booking.id)} style={styles.cancelBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FCA5A5'; e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEE2E2'; e.currentTarget.style.transform = 'rotate(0) scale(1)'; }}>
                      <FiX size={16} />
                    </button>
                  </div>
                  <div style={styles.bookingDetails}>
                    <div style={styles.bookingDetail}>
                      <FiCalendar size={14} color="#6B7280" />
                      <span>{booking.date}</span>
                    </div>
                    <div style={styles.bookingDetail}>
                      <FiClock size={14} color="#6B7280" />
                      <span>{booking.startTime} - {booking.endTime}</span>
                    </div>
                    <div style={styles.bookingDetail}>
                      <FiCheckCircle size={14} color="#6B7280" />
                      <span>By: {booking.bookedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showAddModal && (
          <div style={styles.modalOverlay} onClick={() => setShowAddModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Add New Resource</h3>
                <button onClick={() => setShowAddModal(false)} style={styles.closeBtn} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0) scale(1)'}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleAddResource} style={styles.modalBody}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Resource Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} placeholder="Computer Lab 1" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Type *</label>
                    <select name="type" value={formData.type} onChange={handleInputChange} required style={styles.input}>
                      <option value="lab">Lab</option>
                      <option value="classroom">Classroom</option>
                      <option value="equipment">Equipment</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Capacity *</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required style={styles.input} placeholder="50" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Location *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={styles.input} placeholder="Block A - Floor 2" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status *</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} required style={styles.input}>
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                    <label style={styles.label}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} style={{...styles.input, minHeight: '80px'}} placeholder="Resource description..." />
                  </div>
                </div>
                <div style={styles.modalFooter}>
                  <button type="button" onClick={() => setShowAddModal(false)} style={styles.cancelModalBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                  <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiSave size={16} /> Add Resource
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && (
          <div style={styles.modalOverlay} onClick={() => setShowEditModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Edit Resource</h3>
                <button onClick={() => setShowEditModal(false)} style={styles.closeBtn} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0) scale(1)'}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleEditResource} style={styles.modalBody}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Resource Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Capacity *</label>
                    <input type="number" name="capacity" value={formData.capacity} onChange={handleInputChange} required style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Location *</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} required style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Status *</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} required style={styles.input}>
                      <option value="available">Available</option>
                      <option value="maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                    <label style={styles.label}>Description</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} style={{...styles.input, minHeight: '80px'}} />
                  </div>
                </div>
                <div style={styles.modalFooter}>
                  <button type="button" onClick={() => setShowEditModal(false)} style={styles.cancelModalBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                  <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiSave size={16} /> Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBookModal && selectedResource && (
          <div style={styles.modalOverlay} onClick={() => setShowBookModal(false)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Book Resource</h3>
                <button onClick={() => setShowBookModal(false)} style={styles.closeBtn} onMouseEnter={(e) => e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'rotate(0) scale(1)'}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleBookResource} style={styles.modalBody}>
                <div style={styles.selectedResourceInfo}>
                  <h4>Selected Resource:</h4>
                  <p style={{fontWeight: '600', color: '#1F2937', margin: '4px 0'}}>{selectedResource.name}</p>
                  <p style={{fontSize: '14px', color: '#6B7280'}}>{selectedResource.location} • Capacity: {selectedResource.capacity}</p>
                </div>
                <div style={styles.formGrid}>
                  <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                    <label style={styles.label}>Purpose *</label>
                    <input type="text" name="purpose" value={bookingData.purpose} onChange={handleBookingChange} required style={styles.input} placeholder="Workshop / Event / Lecture" />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Date *</label>
                    <input type="date" name="date" value={bookingData.date} onChange={handleBookingChange} required style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Start Time *</label>
                    <input type="time" name="startTime" value={bookingData.startTime} onChange={handleBookingChange} required style={styles.input} />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>End Time *</label>
                    <input type="time" name="endTime" value={bookingData.endTime} onChange={handleBookingChange} required style={styles.input} />
                  </div>
                  <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
                    <label style={styles.label}>Booked By *</label>
                    <input type="text" name="bookedBy" value={bookingData.bookedBy} onChange={handleBookingChange} required style={styles.input} placeholder="Faculty Name" />
                  </div>
                </div>
                <div style={styles.modalFooter}>
                  <button type="button" onClick={() => setShowBookModal(false)} style={styles.cancelModalBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#E5E7EB'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6'; e.currentTarget.style.transform = 'scale(1)'; }}>Cancel</button>
                  <button type="submit" style={styles.submitBtn} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#4338CA'; e.currentTarget.style.transform = 'scale(1.02)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#4F46E5'; e.currentTarget.style.transform = 'scale(1)'; }}>
                    <FiSave size={16} /> Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#F9FAFB', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' },
  content: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
  toast: { position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', borderRadius: '8px', color: '#FFF', fontWeight: '500', zIndex: 1000, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', animation: 'slideInRight 0.3s ease-out' },
  pageHeader: { marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
  pageTitle: { fontSize: '32px', fontWeight: '700', color: '#1F2937', margin: 0 },
  pageSubtitle: { fontSize: '16px', color: '#6B7280', margin: '8px 0 0 0' },
  addBtn: { padding: '12px 24px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '10px', color: '#FFF', cursor: 'pointer', fontSize: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 4px 6px rgba(79, 70, 229, 0.2)' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  statCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  statIcon: { padding: '12px', borderRadius: '10px', flexShrink: 0 },
  statContent: { flex: 1 },
  statValue: { fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#6B7280' },
  controlsBar: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' },
  searchBox: { flex: 1, minWidth: '250px', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px' },
  searchInput: { flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: '#1F2937' },
  filterGroup: { display: 'flex', alignItems: 'center', gap: '12px' },
  filterSelect: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', cursor: 'pointer', outline: 'none', transition: 'all 0.2s ease' },
  resourcesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' },
  resourceCard: { backgroundColor: '#FFF', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' },
  resourceHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  resourceIcon: { padding: '10px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  statusBadge: { padding: '6px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize' },
  resourceName: { fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' },
  resourceMeta: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6B7280' },
  resourceDesc: { fontSize: '14px', color: '#6B7280', marginBottom: '12px', lineHeight: '1.5' },
  bookingInfo: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '8px', fontSize: '13px', color: '#92400E', marginBottom: '12px' },
  resourceActions: { display: 'flex', gap: '8px' },
  bookBtn: { flex: 1, padding: '10px 16px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  editBtn: { padding: '10px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#3B82F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  deleteBtn: { padding: '10px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  bookingsSection: { backgroundColor: '#FFF', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  sectionTitle: { fontSize: '18px', fontWeight: '600', color: '#1F2937', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' },
  emptyState: { textAlign: 'center', padding: '60px 20px', color: '#6B7280' },
  bookingsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  bookingCard: { padding: '16px', backgroundColor: '#FFF', border: '1px solid #E5E7EB', borderRadius: '10px', transition: 'all 0.2s ease' },
  bookingHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' },
  bookingResource: { fontSize: '16px', fontWeight: '600', color: '#1F2937', marginBottom: '4px' },
  bookingPurpose: { fontSize: '14px', color: '#6B7280' },
  cancelBtn: { padding: '6px', backgroundColor: '#FEE2E2', border: 'none', borderRadius: '6px', color: '#DC2626', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  bookingDetails: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  bookingDetail: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6B7280' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.3s ease-out' },
  modalContent: { backgroundColor: '#FFF', borderRadius: '16px', width: '90%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto', animation: 'slideUp 0.3s ease-out' },
  modalHeader: { padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { margin: 0, fontSize: '24px', fontWeight: '700', color: '#1F2937' },
  closeBtn: { padding: '8px', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', color: '#6B7280', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
  modalBody: { padding: '24px' },
  selectedResourceInfo: { padding: '16px', backgroundColor: '#EEF2FF', borderRadius: '10px', marginBottom: '24px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#374151' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', transition: 'all 0.2s ease', fontFamily: 'inherit' },
  modalFooter: { display: 'flex', gap: '12px', justifyContent: 'flex-end', padding: '24px', borderTop: '1px solid #E5E7EB' },
  cancelModalBtn: { padding: '12px 24px', backgroundColor: '#F3F4F6', border: 'none', borderRadius: '8px', color: '#374151', cursor: 'pointer', fontSize: '14px', fontWeight: '600', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' },
  submitBtn: { padding: '12px 24px', backgroundColor: '#4F46E5', border: 'none', borderRadius: '8px', color: '#FFF', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }
};

export default ResourceManagement;
