import React from 'react';

const UserAvatar = ({ name, imageUrl, size = 'medium' }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`user-avatar avatar-${size}`}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} />
      ) : (
        <div className="avatar-initials">{getInitials(name)}</div>
      )}
    </div>
  );
};

export default UserAvatar;
