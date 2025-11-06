import React, { useState, useEffect } from 'react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({ year: '', section: '' });

  useEffect(() => {
    // Fetch students enrolled in department
  }, [filters]);

  return (
    <div className="student-management">
      <h2>Student Management</h2>
      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
          <option value="">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, section: e.target.value })}>
          <option value="">All Sections</option>
          <option value="A">Section A</option>
          <option value="B">Section B</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Year</th>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.id}>
              <td>{student.rollNo}</td>
              <td>{student.name}</td>
              <td>{student.year}</td>
              <td>{student.section}</td>
              <td><button>View Profile</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentManagement;
