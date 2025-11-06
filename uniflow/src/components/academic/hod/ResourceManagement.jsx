import React, { useState, useEffect } from 'react';

const ResourceManagement = () => {
  const [resources, setResources] = useState([]);

  const handleAddResource = (resourceData) => {
    console.log('Adding resource:', resourceData);
    // Manage department resources
  };

  return (
    <div className="resource-management">
      <h2>Resource Management</h2>
      <button onClick={() => console.log('Add Resource')}>Add Resource</button>
      <div className="resources-grid">
        {resources.map(resource => (
          <div key={resource.id} className="resource-card">
            <h3>{resource.name}</h3>
            <p>Type: {resource.type}</p>
            <p>Quantity: {resource.quantity}</p>
            <p>Status: {resource.status}</p>
            <button>Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResourceManagement;
