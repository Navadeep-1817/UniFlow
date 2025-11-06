import React, { useState, useEffect } from 'react';

const EligibilityCriteria = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleSetCriteria = (criteriaData) => {
    console.log('Setting eligibility criteria:', criteriaData);
    // Set company-wise eligibility
  };

  return (
    <div className="eligibility-criteria">
      <h2>Eligibility Criteria</h2>
      <select onChange={(e) => setSelectedCompany(e.target.value)}>
        <option value="">Select Company</option>
        {companies.map(company => (
          <option key={company.id} value={company.id}>{company.name}</option>
        ))}
      </select>
      {selectedCompany && (
        <div className="criteria-form">
          <h3>Set Criteria</h3>
          <label>
            Minimum CGPA:
            <input type="number" step="0.1" min="0" max="10" />
          </label>
          <label>
            Eligible Departments:
            <input type="text" placeholder="e.g., CSE, ECE" />
          </label>
          <label>
            Maximum Active Backlogs:
            <input type="number" min="0" />
          </label>
          <label>
            Graduation Year:
            <input type="text" placeholder="e.g., 2024" />
          </label>
          <button onClick={handleSetCriteria}>Save Criteria</button>
        </div>
      )}
    </div>
  );
};

export default EligibilityCriteria;
