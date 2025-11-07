import React, { useState } from 'react';
import { FiAward, FiPlus, FiEdit2, FiTrash2, FiX, FiSave, FiFilter, FiSearch, FiCheckCircle, FiEye, FiStar } from 'react-icons/fi';
import { colors, commonStyles, hoverEffects } from '../../../styles/globalStyles';

const ResultsManagement = () => {
  const [results, setResults] = useState([
    { id: 1, eventName: 'Inter-College Cricket Championship', sport: 'Cricket', date: '2024-11-10', winner: 'CSE Warriors',
      runnerUp: 'ECE Titans', score: 'CSE 245/8 vs ECE 198/10', status: 'Published', venue: 'Main Ground' },
    { id: 2, eventName: 'Basketball Tournament Finals', sport: 'Basketball', date: '2024-11-08', winner: 'ME Strikers',
      runnerUp: 'IT Thunder', score: '78-65', status: 'Published', venue: 'Indoor Court' },
    { id: 3, eventName: 'Annual Athletics Meet - 100m Sprint', sport: 'Athletics', date: '2024-11-05', winner: 'Priya Verma (CSE)',
      runnerUp: 'Rahul Kumar (ECE)', score: '11.2s / 11.8s', status: 'Published', venue: 'Sports Complex' },
    { id: 4, eventName: 'Football Inter-Department', sport: 'Football', date: '2024-11-12', winner: 'Pending',
      runnerUp: 'Pending', score: 'Match in Progress', status: 'Pending', venue: 'Football Ground' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [viewingResult, setViewingResult] = useState(null);
  const [filterSport, setFilterSport] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [formData, setFormData] = useState({
    eventName: '', sport: '', date: '', winner: '', runnerUp: '', score: '', venue: '', status: 'Pending'
  });

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingResult) {
      setResults(results.map(r => r.id === editingResult.id ? { ...formData, id: editingResult.id } : r));
      showToast('Result updated successfully!');
    } else {
      setResults([...results, { ...formData, id: Date.now() }]);
      showToast('Result recorded successfully!');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ eventName: '', sport: '', date: '', winner: '', runnerUp: '', score: '', venue: '', status: 'Pending' });
    setEditingResult(null);
    setShowModal(false);
  };

  const handleEdit = (result) => {
    setEditingResult(result);
    setFormData(result);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this result?')) {
      setResults(results.filter(r => r.id !== id));
      showToast('Result deleted!');
    }
  };

  const handlePublish = (id) => {
    setResults(results.map(r => r.id === id ? { ...r, status: 'Published' } : r));
    showToast('Result published successfully!');
  };

  const handleView = (result) => {
    setViewingResult(result);
    setShowViewModal(true);
  };

  const filteredResults = results.filter(r => 
    (filterSport === 'all' || r.sport === filterSport) &&
    (filterStatus === 'all' || r.status === filterStatus) &&
    (r.eventName.toLowerCase().includes(searchQuery.toLowerCase()) || r.sport.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: results.length,
    published: results.filter(r => r.status === 'Published').length,
    pending: results.filter(r => r.status === 'Pending').length,
    sports: [...new Set(results.map(r => r.sport))].length
  };

  const getStatusColor = (status) => {
    return status === 'Published' 
      ? { bg: colors.successLight, color: colors.success }
      : { bg: colors.warningLight, color: colors.warning };
  };

  return (
    <div style={commonStyles.container}>
      {toast.show && <div style={{...commonStyles.toast, backgroundColor: toast.type === 'success' ? colors.success : colors.error}}>{toast.message}</div>}
      
      <div style={commonStyles.content}>
        <div style={commonStyles.pageHeader}>
          <div>
            <h1 style={commonStyles.pageTitle}>Results Management</h1>
            <p style={commonStyles.pageSubtitle}>Record, manage, and publish sports event results</p>
          </div>
          <button onClick={() => setShowModal(true)} style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
            <FiPlus size={18} /> Add Result
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <FiStar size={24} />, value: stats.total, label: 'Total Results', bg: colors.primaryLight, color: colors.primary },
            { icon: <FiCheckCircle size={24} />, value: stats.published, label: 'Published', bg: colors.successLight, color: colors.success },
            { icon: <FiAward size={24} />, value: stats.pending, label: 'Pending', bg: colors.warningLight, color: colors.warning },
            { icon: <FiFilter size={24} />, value: stats.sports, label: 'Sports Categories', bg: colors.infoLight, color: colors.info }
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

        {/* Filters */}
        <div style={commonStyles.card}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            <div style={{ ...commonStyles.searchBox, flex: '1 1 300px' }}>
              <FiSearch size={18} color={colors.gray500} />
              <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '14px', color: colors.gray800 }} />
            </div>
            <select value={filterSport} onChange={(e) => setFilterSport(e.target.value)} style={{ ...commonStyles.input, flex: '0 0 180px' }}>
              <option value="all">All Sports</option>
              <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
              <option value="Basketball">Basketball</option>
              <option value="Athletics">Athletics</option>
              <option value="Badminton">Badminton</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ ...commonStyles.input, flex: '0 0 180px' }}>
              <option value="all">All Status</option>
              <option value="Published">Published</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Results List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredResults.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <FiAward size={48} color={colors.gray400} />
                <p style={{ color: colors.gray500, marginTop: '16px', fontSize: '16px' }}>No results found</p>
              </div>
            ) : filteredResults.map(result => {
              const statusColors = getStatusColor(result.status);
              return (
                <div key={result.id} style={{ ...commonStyles.card, padding: '20px' }} onMouseEnter={hoverEffects.cardHover} onMouseLeave={hoverEffects.cardLeave}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '700', color: colors.gray800, margin: '0 0 8px 0' }}>{result.eventName}</h3>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ ...commonStyles.badge, backgroundColor: colors.primaryLight, color: colors.primary }}>{result.sport}</span>
                        <span style={{ ...commonStyles.badge, ...statusColors }}>{result.status}</span>
                        <span style={{ fontSize: '13px', color: colors.gray500 }}>📅 {new Date(result.date).toLocaleDateString()}</span>
                        <span style={{ fontSize: '13px', color: colors.gray500 }}>📍 {result.venue}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleView(result)} style={{ padding: '8px', backgroundColor: colors.infoLight, border: 'none', borderRadius: '8px', color: colors.info, cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.info; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.infoLight; e.currentTarget.style.color = colors.info; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiEye size={16} />
                      </button>
                      <button onClick={() => handleEdit(result)} style={{ padding: '8px', backgroundColor: colors.primaryLight, border: 'none', borderRadius: '8px', color: colors.primary, cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.primary; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.primaryLight; e.currentTarget.style.color = colors.primary; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(result.id)} style={{ padding: '8px', backgroundColor: colors.errorLight, border: 'none', borderRadius: '8px', color: colors.error, cursor: 'pointer', transition: 'all 0.2s ease' }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = colors.error; e.currentTarget.style.color = colors.white; e.currentTarget.style.transform = 'scale(1.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = colors.errorLight; e.currentTarget.style.color = colors.error; e.currentTarget.style.transform = 'scale(1)'; }}>
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '20px', alignItems: 'center', padding: '20px', backgroundColor: colors.gray50, borderRadius: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>Winner</div>
                      <div style={{ padding: '12px', backgroundColor: colors.successLight, borderRadius: '8px' }}>
                        <FiAward size={20} color={colors.success} style={{ marginBottom: '4px' }} />
                        <div style={{ fontSize: '16px', fontWeight: '700', color: colors.successDark }}>{result.winner}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: colors.gray400 }}>VS</div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '8px' }}>Runner Up</div>
                      <div style={{ padding: '12px', backgroundColor: colors.gray200, borderRadius: '8px' }}>
                        <FiAward size={20} color={colors.gray600} style={{ marginBottom: '4px' }} />
                        <div style={{ fontSize: '16px', fontWeight: '700', color: colors.gray700 }}>{result.runnerUp}</div>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', padding: '12px', backgroundColor: colors.primaryLight, borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.primaryDark, marginBottom: '4px' }}>Final Score</div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: colors.primary }}>{result.score}</div>
                  </div>

                  {result.status === 'Pending' && (
                    <button onClick={() => handlePublish(result.id)} style={{ ...commonStyles.primaryBtn, width: '100%', marginTop: '16px' }}
                      onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                      <FiCheckCircle size={16} /> Publish Result
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div style={commonStyles.modalOverlay} onClick={resetForm}>
            <div style={{ ...commonStyles.modalContent, maxWidth: '700px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
              <div style={commonStyles.modalHeader}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>{editingResult ? 'Edit' : 'Add'} Result</h3>
                <button onClick={resetForm} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                  <FiX size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Event Name *</label>
                    <input type="text" value={formData.eventName} onChange={(e) => setFormData({...formData, eventName: e.target.value})} required style={commonStyles.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Sport *</label>
                    <input type="text" value={formData.sport} onChange={(e) => setFormData({...formData, sport: e.target.value})} required style={commonStyles.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Date *</label>
                    <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required style={commonStyles.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Winner *</label>
                    <input type="text" value={formData.winner} onChange={(e) => setFormData({...formData, winner: e.target.value})} required style={commonStyles.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Runner Up *</label>
                    <input type="text" value={formData.runnerUp} onChange={(e) => setFormData({...formData, runnerUp: e.target.value})} required style={commonStyles.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Score *</label>
                    <input type="text" value={formData.score} onChange={(e) => setFormData({...formData, score: e.target.value})} required style={commonStyles.input} placeholder="e.g., 245/8 vs 198/10" />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Venue *</label>
                    <input type="text" value={formData.venue} onChange={(e) => setFormData({...formData, venue: e.target.value})} required style={commonStyles.input} />
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '600', color: colors.gray700, display: 'block', marginBottom: '8px' }}>Status *</label>
                    <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} required style={commonStyles.input}>
                      <option value="Pending">Pending</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${colors.gray200}` }}>
                  <button type="button" onClick={resetForm} style={commonStyles.secondaryBtn}>Cancel</button>
                  <button type="submit" style={commonStyles.primaryBtn} onMouseEnter={hoverEffects.buttonHover} onMouseLeave={hoverEffects.buttonLeave}>
                    <FiSave size={16} /> {editingResult ? 'Update' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Details Modal */}
        {showViewModal && viewingResult && (
          <div style={commonStyles.modalOverlay} onClick={() => setShowViewModal(false)}>
            <div style={{ ...commonStyles.modalContent, maxWidth: '600px', animation: 'slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} onClick={(e) => e.stopPropagation()}>
              <div style={commonStyles.modalHeader}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: colors.gray800, margin: 0 }}>Result Details</h3>
                <button onClick={() => setShowViewModal(false)} style={{ padding: '8px', backgroundColor: colors.gray100, border: 'none', borderRadius: '8px', color: colors.gray500, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={hoverEffects.closeButtonHover} onMouseLeave={hoverEffects.closeButtonLeave}>
                  <FiX size={20} />
                </button>
              </div>
              <div style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '700', color: colors.gray800, marginBottom: '16px' }}>{viewingResult.eventName}</h4>
                <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.gray500 }}>Sport:</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800, marginLeft: '8px' }}>{viewingResult.sport}</span>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.gray500 }}>Date:</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800, marginLeft: '8px' }}>{new Date(viewingResult.date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ padding: '12px', backgroundColor: colors.gray50, borderRadius: '8px' }}>
                    <span style={{ fontSize: '13px', color: colors.gray500 }}>Venue:</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: colors.gray800, marginLeft: '8px' }}>{viewingResult.venue}</span>
                  </div>
                </div>
                <div style={{ padding: '20px', backgroundColor: colors.successLight, borderRadius: '10px', marginBottom: '12px', textAlign: 'center' }}>
                  <FiAward size={32} color={colors.success} style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.successDark, marginBottom: '4px' }}>Winner</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.success }}>{viewingResult.winner}</div>
                </div>
                <div style={{ padding: '20px', backgroundColor: colors.gray100, borderRadius: '10px', marginBottom: '12px', textAlign: 'center' }}>
                  <FiAward size={32} color={colors.gray600} style={{ marginBottom: '8px' }} />
                  <div style={{ fontSize: '14px', fontWeight: '600', color: colors.gray600, marginBottom: '4px' }}>Runner Up</div>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: colors.gray700 }}>{viewingResult.runnerUp}</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: colors.primaryLight, borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: colors.primaryDark, marginBottom: '4px' }}>Final Score</div>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: colors.primary }}>{viewingResult.score}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsManagement;
