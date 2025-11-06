import React from 'react';

const EventTypeTag = ({ type }) => {
  const getTypeColor = () => {
    switch (type.toLowerCase()) {
      case 'academic':
        return 'blue';
      case 'non-academic':
        return 'orange';
      case 'fdp':
        return 'purple';
      case 'sdp':
        return 'indigo';
      case 'crt':
        return 'teal';
      case 'cultural':
        return 'pink';
      case 'sports':
        return 'green';
      case 'technical':
        return 'cyan';
      default:
        return 'gray';
    }
  };

  return (
    <span className={`event-type-tag type-${getTypeColor()}`}>
      {type}
    </span>
  );
};

export default EventTypeTag;
