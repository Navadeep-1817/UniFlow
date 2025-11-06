import React, { useState, useEffect } from 'react';

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ type: '', dateRange: '' });

  useEffect(() => {
    // Fetch system logs - audit trail of all activities
  }, [filters]);

  return (
    <div className="system-logs">
      <h2>System Logs</h2>
      <div className="filters">
        <select onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Activities</option>
          <option value="login">Login</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Action</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{log.timestamp}</td>
              <td>{log.user}</td>
              <td>{log.action}</td>
              <td>{log.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SystemLogs;
