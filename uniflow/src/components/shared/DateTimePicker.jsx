import React from 'react';

const DateTimePicker = ({ value, onChange, includeTime = true }) => {
  return (
    <div className="datetime-picker">
      <input
        type="date"
        value={value?.date || ''}
        onChange={(e) => onChange({ ...value, date: e.target.value })}
      />
      {includeTime && (
        <input
          type="time"
          value={value?.time || ''}
          onChange={(e) => onChange({ ...value, time: e.target.value })}
        />
      )}
    </div>
  );
};

export default DateTimePicker;
