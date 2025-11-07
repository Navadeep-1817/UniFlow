// UniFlow Global Design System - Use this for consistent styling across all components

export const colors = {
  // Primary Blue Theme
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  primaryLight: '#EEF2FF',
  primaryBorder: '#C7D2FE',
  
  // Neutrals
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  
  // Status Colors
  success: '#10B981',
  successLight: '#D1FAE5',
  successDark: '#065F46',
  
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#92400E',
  
  error: '#EF4444',
  errorLight: '#FEE2E2',
  
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  
  purple: '#7C3AED',
  purpleLight: '#DDD6FE',
  
  pink: '#EC4899',
  pinkLight: '#FBCFE8',
  
  teal: '#14B8A6',
  tealLight: '#CCFBF1'
};

export const commonStyles = {
  // Container - White background for body
  container: {
    minHeight: '100vh',
    backgroundColor: colors.white,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  
  // Content wrapper
  content: {
    padding: '24px',
    maxWidth: '1600px',
    margin: '0 auto'
  },
  
  // Page Header
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
    color: colors.gray800,
    margin: 0
  },
  
  pageSubtitle: {
    fontSize: '16px',
    color: colors.gray500,
    margin: '8px 0 0 0'
  },
  
  // Cards with blue accents
  card: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: `1px solid ${colors.gray200}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)',
    borderColor: colors.primaryLight
  },
  
  // Stat Cards
  statCard: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: `1px solid ${colors.gray200}`,
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer'
  },
  
  statIcon: {
    padding: '12px',
    borderRadius: '10px',
    flexShrink: 0
  },
  
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: colors.gray800,
    marginBottom: '4px'
  },
  
  statLabel: {
    fontSize: '14px',
    color: colors.gray500,
    fontWeight: '500'
  },
  
  // Primary Button
  primaryBtn: {
    padding: '12px 24px',
    backgroundColor: colors.primary,
    border: 'none',
    borderRadius: '10px',
    color: colors.white,
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 4px 6px rgba(79, 70, 229, 0.2)`
  },
  
  primaryBtnHover: {
    backgroundColor: colors.primaryHover,
    transform: 'scale(1.05)',
    boxShadow: `0 6px 12px rgba(79, 70, 229, 0.3)`
  },
  
  // Secondary Button
  secondaryBtn: {
    padding: '10px 20px',
    backgroundColor: colors.gray100,
    border: 'none',
    borderRadius: '8px',
    color: colors.gray700,
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  secondaryBtnHover: {
    backgroundColor: colors.gray200,
    transform: 'scale(1.02)'
  },
  
  // Input Fields
  input: {
    padding: '10px 12px',
    border: `1px solid ${colors.gray200}`,
    borderRadius: '8px',
    fontSize: '14px',
    color: colors.gray800,
    outline: 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: colors.white
  },
  
  inputFocus: {
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px ${colors.primaryLight}`
  },
  
  // Modal
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out'
  },
  
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    maxWidth: '800px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
    animation: 'slideUp 0.3s ease-out'
  },
  
  modalHeader: {
    padding: '24px',
    borderBottom: `1px solid ${colors.gray200}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: colors.white,
    zIndex: 10
  },
  
  // Toast Notification
  toast: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '16px 24px',
    borderRadius: '8px',
    color: colors.white,
    fontWeight: '500',
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    animation: 'slideInRight 0.3s ease-out'
  },
  
  // Badge
  badge: {
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  
  // Search Box
  searchBox: {
    flex: 1,
    minWidth: '250px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 16px',
    backgroundColor: colors.gray50,
    borderRadius: '8px',
    border: `1px solid ${colors.gray200}`,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  
  searchBoxFocus: {
    backgroundColor: colors.white,
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px ${colors.primaryLight}`
  },
  
  // Control Bar
  controlsBar: {
    backgroundColor: colors.white,
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: `1px solid ${colors.gray200}`,
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
};

// Animation Keyframes (Add to your global CSS or use styled-components)
export const animations = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

// Hover Effect Handlers - Reusable
export const hoverEffects = {
  cardHover: (e) => {
    e.currentTarget.style.transform = 'translateY(-2px)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.15)';
    e.currentTarget.style.borderColor = colors.primaryLight;
  },
  
  cardLeave: (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
    e.currentTarget.style.borderColor = colors.gray200;
  },
  
  statCardHover: (e) => {
    e.currentTarget.style.transform = 'translateY(-4px)';
    e.currentTarget.style.boxShadow = '0 8px 16px rgba(79, 70, 229, 0.2)';
  },
  
  statCardLeave: (e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
  },
  
  buttonHover: (e) => {
    e.currentTarget.style.backgroundColor = colors.primaryHover;
    e.currentTarget.style.transform = 'scale(1.05)';
  },
  
  buttonLeave: (e) => {
    e.currentTarget.style.backgroundColor = colors.primary;
    e.currentTarget.style.transform = 'scale(1)';
  },
  
  iconButtonHover: (e) => {
    e.currentTarget.style.transform = 'scale(1.1)';
  },
  
  iconButtonLeave: (e) => {
    e.currentTarget.style.transform = 'scale(1)';
  },
  
  closeButtonHover: (e) => {
    e.currentTarget.style.transform = 'rotate(90deg) scale(1.1)';
  },
  
  closeButtonLeave: (e) => {
    e.currentTarget.style.transform = 'rotate(0) scale(1)';
  }
};

export default { colors, commonStyles, animations, hoverEffects };
