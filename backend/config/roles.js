// Role hierarchy and permissions
const ROLES = {
  SUPER_ADMIN: 'superadmin',
  ACADEMIC_ADMIN_HOD: 'academic_admin_hod',
  ACADEMIC_ADMIN_TP: 'academic_admin_tp',
  NON_ACADEMIC_FACULTY_HEAD: 'non_academic_faculty_head',
  NON_ACADEMIC_TEAM_REP: 'non_academic_team_rep',
  SPORTS_ADMIN: 'sports',
  FACULTY: 'faculty',
  STUDENT: 'student',
  TRAINER: 'trainer',
};

// Role hierarchy levels (higher number = more privileges)
const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 7,
  [ROLES.ACADEMIC_ADMIN_HOD]: 6,
  [ROLES.ACADEMIC_ADMIN_TP]: 6,
  [ROLES.NON_ACADEMIC_FACULTY_HEAD]: 5,
  [ROLES.SPORTS_ADMIN]: 5,
  [ROLES.NON_ACADEMIC_TEAM_REP]: 4,
  [ROLES.FACULTY]: 3,
  [ROLES.TRAINER]: 2,
  [ROLES.STUDENT]: 1,
};

// Permissions mapping
const PERMISSIONS = {
  // Super Admin
  MANAGE_ALL_UNIVERSITIES: [ROLES.SUPER_ADMIN],
  APPROVE_ADMINS: [ROLES.SUPER_ADMIN],
  VIEW_ALL_ANALYTICS: [ROLES.SUPER_ADMIN],
  
  // Academic Admins
  CREATE_ACADEMIC_EVENTS: [
    ROLES.SUPER_ADMIN,
    ROLES.ACADEMIC_ADMIN_HOD,
    ROLES.ACADEMIC_ADMIN_TP
  ],
  MANAGE_DEPARTMENT: [
    ROLES.SUPER_ADMIN,
    ROLES.ACADEMIC_ADMIN_HOD
  ],
  MANAGE_PLACEMENTS: [
    ROLES.SUPER_ADMIN,
    ROLES.ACADEMIC_ADMIN_TP
  ],
  
  // Non-Academic Admins
  CREATE_NON_ACADEMIC_EVENTS: [
    ROLES.SUPER_ADMIN,
    ROLES.NON_ACADEMIC_FACULTY_HEAD,
    ROLES.NON_ACADEMIC_TEAM_REP
  ],
  APPROVE_STUDENT_BODY_EVENTS: [
    ROLES.SUPER_ADMIN,
    ROLES.NON_ACADEMIC_FACULTY_HEAD
  ],
  MANAGE_STUDENT_BODY: [
    ROLES.SUPER_ADMIN,
    ROLES.NON_ACADEMIC_FACULTY_HEAD,
    ROLES.NON_ACADEMIC_TEAM_REP
  ],
  
  // Faculty
  MARK_ATTENDANCE: [
    ROLES.SUPER_ADMIN,
    ROLES.ACADEMIC_ADMIN_HOD,
    ROLES.ACADEMIC_ADMIN_TP,
    ROLES.NON_ACADEMIC_FACULTY_HEAD,
    ROLES.NON_ACADEMIC_TEAM_REP,
    ROLES.FACULTY
  ],
  
  // Student
  REGISTER_FOR_EVENTS: [ROLES.STUDENT],
  SUBMIT_FEEDBACK: [ROLES.STUDENT],
};

// Helper function to check if role has permission
const hasPermission = (userRole, permission) => {
  return PERMISSIONS[permission]?.includes(userRole) || false;
};

// Helper function to check if user can access resource
const canAccessResource = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

module.exports = {
  ROLES,
  ROLE_HIERARCHY,
  PERMISSIONS,
  hasPermission,
  canAccessResource,
};