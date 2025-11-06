import React, { useState, useEffect } from 'react';

const StudentPlacementStatus = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ status: '', department: '' });

  useEffect(() => {
    // Fetch student placement records
  }, [filters]);

  return (
    <div className="student-placement-status">
      <h2>Student Placement Status</h2>
      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="placed">Placed</option>
          <option value="in-process">In Process</option>
          <option value="not-placed">Not Placed</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, department: e.target.value })}>
          <option value="">All Departments</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Department</th>
            <th>Status</th>
            <th>Company</th>
            <th>Package</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td>{student.department}</td>
              <td>{student.status}</td>
              <td>{student.company || 'N/A'}</td>
              <td>{student.package || 'N/A'}</td>
              <td><button>View Details</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentPlacementStatus;
