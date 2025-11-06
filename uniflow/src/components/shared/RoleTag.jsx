import React from 'react';

const RoleTag = ({ role }) => {
  const getRoleColor = () => {
    switch (role.toLowerCase()) {
      case 'superadmin':
        return 'purple';
      case 'admin':
        return 'blue';
      case 'hod':
        return 'indigo';
      case 'faculty':
        return 'green';
      case 'student':
        return 'gray';
      case 'placement':
        return 'teal';
      default:
        return 'gray';
    }
  };

  return (
    <span className={`role-tag role-${getRoleColor()}`}>
      {role}
    </span>
  );
};

export default RoleTag;
