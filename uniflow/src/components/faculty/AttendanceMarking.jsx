import React, { useState, useEffect } from 'react';

const AttendanceMarking = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [students, setStudents] = useState([]);

  const handleMarkAttendance = (studentId, status) => {
    console.log('Marking attendance:', studentId, status);
    // Mark student attendance
  };

  return (
    <div className="attendance-marking">
      <h2>Mark Attendance</h2>
      <select onChange={(e) => setSelectedSession(e.target.value)}>
        <option value="">Select Session</option>
        {sessions.map(session => (
          <option key={session.id} value={session.id}>
            {session.title} - {session.date}
          </option>
        ))}
      </select>
      {selectedSession && (
        <div className="attendance-interface">
          <button>Scan QR Code</button>
          <button>Mark All Present</button>
          <button>Generate QR</button>
          <table>
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student.id}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>{student.attendanceStatus || 'Not Marked'}</td>
                  <td>
                    <button onClick={() => handleMarkAttendance(student.id, 'present')}>
                      Present
                    </button>
                    <button onClick={() => handleMarkAttendance(student.id, 'absent')}>
                      Absent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button>Submit Attendance</button>
        </div>
      )}
    </div>
  );
};

export default AttendanceMarking;
