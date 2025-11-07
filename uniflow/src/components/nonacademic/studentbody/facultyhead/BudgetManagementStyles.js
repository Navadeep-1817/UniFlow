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
    margin: 0
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
    transition: 'all 0.2s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '32px'
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer'
  },
  statCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
  },
  statLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: '8px'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  statSubtext: {
    fontSize: '12px',
    color: '#9CA3AF'
  },
  tabsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  tabsHeader: {
    display: 'flex',
    borderBottom: '1px solid #E5E7EB',
    padding: '0 24px'
  },
  tab: {
    padding: '16px 24px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#6B7280',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    position: 'relative'
  },
  tabActive: {
    borderBottomColor: '#4F46E5',
    color: '#4F46E5'
  },
  badge: {
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '12px',
    marginLeft: '8px'
  },
  tabContent: {
    padding: '24px'
  },
  overviewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px'
  },
  chartPlaceholder: {
    backgroundColor: '#F9FAFB',
    padding: '24px',
    borderRadius: '8px',
    minHeight: '300px'
  },
  chartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px'
  },
  chartInfo: {
    marginTop: '24px'
  },
  chartLegend: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151'
  },
  legendDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  departmentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '16px'
  },
  departmentItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#FFFFFF',
    borderRadius: '6px',
    fontSize: '14px'
  },
  departmentName: {
    color: '#374151',
    fontWeight: '500'
  },
  departmentAmount: {
    color: '#4F46E5',
    fontWeight: '600'
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
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
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeaderRow: {
    backgroundColor: '#F9FAFB'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tableRow: {
    borderBottom: '1px solid #E5E7EB',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#374151'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600'
  },
  linkButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#4F46E5',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#6B7280',
    fontSize: '16px'
  },
  approvalsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  approvalCard: {
    backgroundColor: '#F9FAFB',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s'
  },
  approvalContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    flexWrap: 'wrap'
  },
  approvalTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  approvalDescription: {
    fontSize: '14px',
    color: '#6B7280',
    marginBottom: '12px'
  },
  approvalMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
    color: '#6B7280'
  },
  approvalActions: {
    display: 'flex',
    gap: '12px'
  },
  approveButton: {
    padding: '8px 16px',
    backgroundColor: '#10B981',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  rejectButton: {
    padding: '8px 16px',
    backgroundColor: '#DC2626',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '32px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
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
    transition: 'color 0.2s'
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
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px'
  },
  secondaryButton: {
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
  expenseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    marginBottom: '24px'
  },
  expenseCard: {
    backgroundColor: '#F9FAFB',
    padding: '16px',
    borderRadius: '8px'
  },
  expenseLabel: {
    fontSize: '12px',
    color: '#6B7280',
    marginBottom: '4px'
  },
  expenseValue: {
    fontSize: '20px',
    fontWeight: '700'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '16px'
  },
  expenseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  expenseItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#F9FAFB',
    borderRadius: '8px'
  },
  expenseDescription: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    marginBottom: '4px'
  },
  expenseDate: {
    fontSize: '12px',
    color: '#6B7280'
  },
  expenseAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '4px'
  }
};
