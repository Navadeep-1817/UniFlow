import React, { useState, useEffect } from 'react';
import { FiUser, FiCheckCircle, FiXCircle, FiClock, FiAward, FiDollarSign, FiSearch, FiFilter, FiEye, FiDownload, FiBriefcase, FiCalendar, FiMapPin } from 'react-icons/fi';
import PlacementTopNav from './PlacementTopNav';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const StudentPlacementStatus = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    setStudents([
      { id: 1, rollNo: 'CS2021001', name: 'Rajesh Kumar', department: 'Computer Science', email: 'rajesh@student.edu',
        phone: '+91 98765 11111', cgpa: 8.5, status: 'placed', eligible: true, shortlisted: ['TCS', 'Infosys', 'Amazon'],
        interviewed: ['TCS', 'Amazon'], selected: ['TCS', 'Amazon'], company: 'Amazon', role: 'SDE-1', package: '28.5',
        offerDate: '2024-12-10', joiningDate: '2025-07-01', location: 'Bangalore' },
      { id: 2, rollNo: 'CS2021002', name: 'Priya Sharma', department: 'Computer Science', email: 'priya@student.edu',
        phone: '+91 98765 22222', cgpa: 9.1, status: 'placed', eligible: true, shortlisted: ['TCS', 'Infosys', 'Microsoft'],
        interviewed: ['TCS', 'Microsoft'], selected: ['TCS'], company: 'TCS', role: 'Software Developer', package: '7.5',
        offerDate: '2024-12-05', joiningDate: '2025-07-15', location: 'Bangalore' },
      { id: 3, rollNo: 'ECE2021003', name: 'Amit Patel', department: 'Electronics', email: 'amit@student.edu',
        phone: '+91 98765 33333', cgpa: 7.8, status: 'interviewed', eligible: true, shortlisted: ['Infosys', 'Wipro'],
        interviewed: ['Infosys'], selected: [], company: null, role: null, package: null,
        offerDate: null, joiningDate: null, location: null },
      { id: 4, rollNo: 'CS2021004', name: 'Neha Singh', department: 'Computer Science', email: 'neha@student.edu',
        phone: '+91 98765 44444', cgpa: 8.9, status: 'shortlisted', eligible: true, shortlisted: ['Google', 'Microsoft', 'Amazon'],
        interviewed: [], selected: [], company: null, role: null, package: null,
        offerDate: null, joiningDate: null, location: null },
      { id: 5, rollNo: 'ME2021005', name: 'Vikram Reddy', department: 'Mechanical', email: 'vikram@student.edu',
        phone: '+91 98765 55555', cgpa: 7.2, status: 'eligible', eligible: true, shortlisted: [],
        interviewed: [], selected: [], company: null, role: null, package: null,
        offerDate: null, joiningDate: null, location: null },
      { id: 6, rollNo: 'CS2021006', name: 'Sneha Gupta', department: 'Computer Science', email: 'sneha@student.edu',
        phone: '+91 98765 66666', cgpa: 5.8, status: 'not-eligible', eligible: false, shortlisted: [],
        interviewed: [], selected: [], company: null, role: null, package: null,
        offerDate: null, joiningDate: null, location: null }
    ]);
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleExport = () => {
    showToast('Student placement data exported successfully!');
  };

  const getStatusBadge = (status) => ({
    'placed': { bg: colors.successLight, color: colors.successDark, icon: <FiCheckCircle size={14} />, label: 'Placed' },
    'interviewed': { bg: colors.infoLight, color: colors.infoDark, icon: <FiClock size={14} />, label: 'Interviewed' },
    'shortlisted': { bg: colors.warningLight, color: colors.warningDark, icon: <FiAward size={14} />, label: 'Shortlisted' },
    'eligible': { bg: colors.primaryLight, color: colors.primary, icon: <FiUser size={14} />, label: 'Eligible' },
    'not-eligible': { bg: colors.errorLight, color: colors.error, icon: <FiXCircle size={14} />, label: 'Not Eligible' }
  }[status] || {});

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesDept = filterDepartment === 'all' || s.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const stats = {
    total: students.length,
    placed: students.filter(s => s.status === 'placed').length,
    inProcess: students.filter(s => ['interviewed', 'shortlisted'].includes(s.status)).length,
    eligible: students.filter(s => s.status === 'eligible').length,
    notEligible: students.filter(s => s.status === 'not-eligible').length
  };

  const TimelineStep = ({ label, active, completed }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%',
        backgroundColor: completed ? colors.success : active ? colors.primary : colors.gray300,
        display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
        {completed ? <FiCheckCircle size={14} color={colors.white} /> : 
         <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.white }} />}
      </div>
      <span style={{ fontSize: '13px', fontWeight: '500', color: completed || active ? colors.gray800 : colors.gray500 }}>{label}</span>
    </div>
  );

  return (
    <div style={commonStyles.container}>
      <PlacementTopNav />
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Student Placement Status</h1>
            <p style={commonStyles.pageSubtitle}>Track individual student placement progress and outcomes</p>
          </div>
          <button onClick={handleExport} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
            <FiDownload size={18} /> Export Data
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiUser size={24} />, value: stats.total, label: 'Total Students', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiCheckCircle size={24} />, value: stats.placed, label: 'Placed', bg: colors.successLight, color: colors.success },
            { icon: <FiClock size={24} />, value: stats.inProcess, label: 'In Process', bg: colors.infoLight, color: colors.info },
            { icon: <FiAward size={24} />, value: stats.eligible, label: 'Eligible', bg: colors.warningLight, color: colors.warning },
            { icon: <FiXCircle size={24} />, value: stats.notEligible, label: 'Not Eligible', bg: colors.errorLight, color: colors.error }
          ].map((stat, i) => (
            <div key={i} style={commonStyles.statCard} onMouseEnter={hoverEffects.statCardHover} onMouseLeave={hoverEffects.statCardLeave}>
              <div style={{...commonStyles.statIcon, backgroundColor: stat.bg, color: stat.color}}>{stat.icon}</div>
              <div style={commonStyles.statContent}>
                <div style={commonStyles.statValue}>{stat.value}</div>
                <div style={commonStyles.statLabel}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '250px', ...commonStyles.searchBox }}>
            <FiSearch size={18} color={colors.gray500} />
            <input type="text" placeholder="Search by name or roll number..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
              style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: colors.gray800 }} />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <FiFilter size={16} color={colors.gray500} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} 
              style={{ ...commonStyles.input, width: 'auto', padding: '10px 14px' }}>
              <option value="all">All Status</option>
              <option value="placed">Placed</option>
              <option value="interviewed">Interviewed</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="eligible">Eligible</option>
              <option value="not-eligible">Not Eligible</option>
            </select>
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} 
              style={{ ...commonStyles.input, width: 'auto', padding: '10px 14px' }}>
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredStudents.length === 0 ? (
            <div style={{ ...commonStyles.card, textAlign: 'center', padding: '60px 20px' }}>
              <FiUser size={48} color={colors.gray400} />
              <p style={{ color: colors.gray500, marginTop: '16px' }}>No students found</p>
            </div>
          ) : filteredStudents.map(student => {
            const statusBadge = getStatusBadge(student.status);
            return (
              <div key={student.id} style={commonStyles.card} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'start', flex: 1 }}>
                    <div style={{ padding: '12px', backgroundColor: colors.primaryLight, borderRadius: '10px' }}>
                      <FiUser size={24} color={colors.primary} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{student.name}</h3>
                      <p style={{ fontSize: '14px', color: colors.gray500, margin: '0 0 8px 0' }}>
                        {student.rollNo} • {student.department} • CGPA: {student.cgpa}
                      </p>
                      <span style={{ ...commonStyles.badge, backgroundColor: statusBadge.bg, color: statusBadge.color, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {statusBadge.icon} {statusBadge.label}
                      </span>
                    </div>
                  </div>
                  {student.status === 'placed' && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: colors.success, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiDollarSign size={16} />₹{student.package} LPA
                      </div>
                      <div style={{ fontSize: '13px', color: colors.gray600, marginTop: '2px' }}>{student.company}</div>
                    </div>
                  )}
                </div>

                <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700, marginBottom: '12px' }}>Placement Progress</div>
                  <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                    <TimelineStep label="Eligible" completed={student.eligible} active={student.status === 'eligible'} />
                    <TimelineStep label="Shortlisted" completed={student.shortlisted.length > 0} active={student.status === 'shortlisted'} />
                    <TimelineStep label="Interviewed" completed={student.interviewed.length > 0} active={student.status === 'interviewed'} />
                    <TimelineStep label="Selected" completed={student.selected.length > 0} active={false} />
                    <TimelineStep label="Placed" completed={student.status === 'placed'} active={false} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                  {student.shortlisted.length > 0 && (
                    <div style={{ fontSize: '13px', color: colors.gray600 }}>
                      <span style={{ fontWeight: '600', color: colors.gray700 }}>Shortlisted:</span> {student.shortlisted.length} companies
                    </div>
                  )}
                  {student.interviewed.length > 0 && (
                    <div style={{ fontSize: '13px', color: colors.gray600 }}>
                      <span style={{ fontWeight: '600', color: colors.gray700 }}>Interviewed:</span> {student.interviewed.length} companies
                    </div>
                  )}
                  {student.selected.length > 0 && (
                    <div style={{ fontSize: '13px', color: colors.gray600 }}>
                      <span style={{ fontWeight: '600', color: colors.gray700 }}>Selected:</span> {student.selected.length} offers
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '16px', borderTop: `1px solid ${colors.gray200}` }}>
                  <button onClick={() => { setViewingStudent(student); setShowViewModal(true); }} 
                    style={{ padding: '8px 16px', backgroundColor: colors.primary, border: 'none', borderRadius: '8px', color: colors.white, 
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = `0 4px 12px ${colors.primary}40`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}>
                    <FiEye size={16} /> View Full Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showViewModal && viewingStudent && (
        <div style={commonStyles.modalOverlay} onClick={() => setShowViewModal(false)}>
          <div style={{ ...commonStyles.modalContent, maxWidth: '800px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
            <div style={commonStyles.modalHeader}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: '0 0 4px 0' }}>{viewingStudent.name}</h3>
                <p style={{ fontSize: '14px', color: colors.gray500, margin: 0 }}>{viewingStudent.rollNo} • {viewingStudent.department}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} 
                style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                <FiX size={20} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ padding: '16px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, marginBottom: '12px' }}>Student Information</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Email:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingStudent.email}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Phone:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingStudent.phone}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>CGPA:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{viewingStudent.cgpa}</span></div>
                    <div><span style={{ fontSize: '13px', color: colors.gray500 }}>Status:</span> <span style={{ fontSize: '13px', fontWeight: '600', color: colors.gray700 }}>{getStatusBadge(viewingStudent.status).label}</span></div>
                  </div>
                </div>

                {viewingStudent.shortlisted.length > 0 && (
                  <div style={{ padding: '16px', backgroundColor: colors.warningLight, borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.warningDark, marginBottom: '8px' }}>Shortlisted Companies</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {viewingStudent.shortlisted.map((company, i) => (
                        <span key={i} style={{ padding: '6px 12px', backgroundColor: colors.white, borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: colors.gray700 }}>
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewingStudent.interviewed.length > 0 && (
                  <div style={{ padding: '16px', backgroundColor: colors.infoLight, borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.infoDark, marginBottom: '8px' }}>Interviewed Companies</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {viewingStudent.interviewed.map((company, i) => (
                        <span key={i} style={{ padding: '6px 12px', backgroundColor: colors.white, borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: colors.gray700 }}>
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewingStudent.selected.length > 0 && (
                  <div style={{ padding: '16px', backgroundColor: colors.successLight, borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.successDark, marginBottom: '8px' }}>Selected/Offers Received</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {viewingStudent.selected.map((company, i) => (
                        <span key={i} style={{ padding: '6px 12px', backgroundColor: colors.white, borderRadius: '6px', fontSize: '13px', fontWeight: '500', color: colors.gray700 }}>
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {viewingStudent.status === 'placed' && (
                  <div style={{ padding: '20px', backgroundColor: colors.successLight, borderRadius: '8px', border: `2px solid ${colors.success}` }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: colors.successDark, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiBriefcase size={20} /> Placement Details
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Company</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800 }}>{viewingStudent.company}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Role</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800 }}>{viewingStudent.role}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Package</div>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: colors.success, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiDollarSign size={16} />₹{viewingStudent.package} LPA
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Location</div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: colors.gray800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiMapPin size={14} />{viewingStudent.location}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Offer Date</div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: colors.gray700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiCalendar size={14} />{viewingStudent.offerDate}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: colors.gray500, marginBottom: '4px' }}>Joining Date</div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: colors.gray700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FiCalendar size={14} />{viewingStudent.joiningDate}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {viewingStudent.status === 'not-eligible' && (
                  <div style={{ padding: '16px', backgroundColor: colors.errorLight, borderRadius: '8px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: colors.error, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiXCircle size={18} /> Not Eligible
                    </div>
                    <div style={{ fontSize: '13px', color: colors.gray600 }}>This student does not meet the minimum eligibility criteria for placements.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPlacementStatus;
