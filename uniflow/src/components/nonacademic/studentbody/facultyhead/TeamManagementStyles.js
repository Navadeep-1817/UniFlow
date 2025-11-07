export const styles = {
  container: {
    padding: '24px',
    backgroundColor: '#F9FAFB',
    minHeight: 'calc(100vh - 73px)'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 73px)',
    gap: '16px'
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #E5E7EB',
    borderTop: '4px solid #4F46E5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '16px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6B7280'
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  primaryButton: {
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  secondaryButton: {
    padding: '12px 24px',
    backgroundColor: '#FFFFFF',
    color: '#374151',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s',
    cursor: 'pointer'
  },
  statCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  statLabel: {
    fontSize: '13px',
    color: '#6B7280',
    marginBottom: '4px'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827'
  },
  filtersContainer: {
    backgroundColor: '#FFFFFF',
    padding: '16px 20px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '24px',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '250px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6B7280'
  },
  searchInput: {
    width: '100%',
    padding: '8px 12px 8px 36px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    boxSizing: 'border-box'
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    backgroundColor: '#FFFFFF',
    cursor: 'pointer'
  },
  teamsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px'
  },
  teamCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    animation: 'fadeIn 0.5s ease-out'
  },
  teamCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
  },
  teamHeader: {
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#FFFFFF',
    position: 'relative'
  },
  teamBadge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    backgroundColor: 'rgba(255,255,255,0.2)',
    backdropFilter: 'blur(10px)'
  },
  teamTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '8px',
    color: '#FFFFFF'
  },
  teamCategory: {
    fontSize: '13px',
    opacity: 0.9,
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  teamBody: {
    padding: '20px'
  },
  teamStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '12px'
  },
  teamStatItem: {
    textAlign: 'center'
  },
  teamStatValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#4F46E5',
    marginBottom: '4px'
  },
  teamStatLabel: {
    fontSize: '11px',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  membersList: {
    marginBottom: '16px'
  },
  membersHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  membersTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827'
  },
  memberItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px',
    marginBottom: '8px',
    transition: 'all 0.2s'
  },
  memberItemHover: {
    backgroundColor: '#EEF2FF',
    transform: 'translateX(4px)'
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1
  },
  memberAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
    flexShrink: 0
  },
  memberDetails: {
    flex: 1
  },
  memberName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '2px'
  },
  memberRole: {
    fontSize: '12px',
    color: '#6B7280'
  },
  memberActions: {
    display: 'flex',
    gap: '8px'
  },
  iconButton: {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s'
  },
  editIconButton: {
    backgroundColor: '#EEF2FF',
    color: '#4F46E5'
  },
  deleteIconButton: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626'
  },
  teamActions: {
    display: 'flex',
    gap: '8px'
  },
  actionButton: {
    flex: 1,
    padding: '10px 16px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    transition: 'all 0.2s'
  },
  viewButton: {
    backgroundColor: '#4F46E5',
    color: '#FFFFFF'
  },
  manageButton: {
    backgroundColor: '#F3F4F6',
    color: '#374151'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out'
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '600px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    animation: 'slideIn 0.3s ease-out'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '24px'
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px'
  },
  modalSubtitle: {
    fontSize: '14px',
    color: '#6B7280'
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '32px',
    color: '#6B7280',
    cursor: 'pointer',
    lineHeight: 1,
    transition: 'all 0.2s'
  },
  formGroup: {
    marginBottom: '20px'
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
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#111827',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #D1D5DB',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#111827',
    fontFamily: 'inherit',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  submitButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#4F46E5',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  cancelButton: {
    flex: 1,
    padding: '12px 24px',
    backgroundColor: '#E5E7EB',
    color: '#374151',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '64px 24px',
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
    color: '#9CA3AF'
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: '#6B7280'
  },
  roleBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    display: 'inline-block'
  }
};
