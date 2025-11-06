import React, { useState, useEffect } from 'react';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);

  const handleAddCompany = (companyData) => {
    console.log('Adding company:', companyData);
    // Maintain company database
  };

  return (
    <div className="company-management">
      <h2>Company Management</h2>
      <button onClick={() => console.log('Add Company')}>Add Company</button>
      <table>
        <thead>
          <tr>
            <th>Company Name</th>
            <th>Industry</th>
            <th>Contact Person</th>
            <th>Email</th>
            <th>Previous Visits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.id}>
              <td>{company.name}</td>
              <td>{company.industry}</td>
              <td>{company.contactPerson}</td>
              <td>{company.email}</td>
              <td>{company.previousVisits}</td>
              <td>
                <button>Edit</button>
                <button>View History</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyManagement;
