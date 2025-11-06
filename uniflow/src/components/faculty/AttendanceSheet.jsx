import React, { useState, useEffect } from 'react';

const AttendanceSheet = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const handleExport = (format) => {
    console.log('Exporting attendance in format:', format);
    // View/export attendance records
  };

  return (
    <div className="attendance-sheet">
      <h2>Attendance Sheet</h2>
      <select onChange={(e) => setSelectedEvent(e.target.value)}>
        <option value="">Select Event</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>
      {selectedEvent && (
        <>
          <div className="export-options">
            <button onClick={() => handleExport('pdf')}>Export PDF</button>
            <button onClick={() => handleExport('excel')}>Export Excel</button>
            <button onClick={() => handleExport('csv')}>Export CSV</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Session 1</th>
                <th>Session 2</th>
                <th>Session 3</th>
                <th>Total</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map(record => (
                <tr key={record.id}>
                  <td>{record.rollNo}</td>
                  <td>{record.name}</td>
                  <td>{record.session1}</td>
                  <td>{record.session2}</td>
                  <td>{record.session3}</td>
                  <td>{record.total}</td>
                  <td>{record.percentage}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AttendanceSheet;
