import React, { useState, useEffect } from 'react';

const StudentProgress = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);

  useEffect(() => {
    // Track student participation
  }, [selectedEvent]);

  return (
    <div className="student-progress">
      <h2>Student Progress Tracking</h2>
      <select onChange={(e) => setSelectedEvent(e.target.value)}>
        <option value="">Select Event</option>
        {events.map(event => (
          <option key={event.id} value={event.id}>{event.name}</option>
        ))}
      </select>
      {selectedEvent && (
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Attendance</th>
              <th>Assignments</th>
              <th>Performance</th>
              <th>Remarks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentProgress.map(student => (
              <tr key={student.id}>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>{student.attendance}%</td>
                <td>{student.assignments}</td>
                <td>{student.performance}</td>
                <td>{student.remarks}</td>
                <td>
                  <button>View Details</button>
                  <button>Add Remark</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StudentProgress;
