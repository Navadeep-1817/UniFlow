import React, { useState } from 'react';

const SystemConfiguration = () => {
  const [config, setConfig] = useState({
    maintenanceMode: false,
    emailNotifications: true,
    autoApproval: false
  });

  const handleConfigUpdate = () => {
    console.log('Updating config:', config);
    // Platform-wide settings
  };

  return (
    <div className="system-configuration">
      <h2>System Configuration</h2>
      <div className="config-options">
        <label>
          <input 
            type="checkbox" 
            checked={config.maintenanceMode}
            onChange={(e) => setConfig({ ...config, maintenanceMode: e.target.checked })}
          />
          Maintenance Mode
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={config.emailNotifications}
            onChange={(e) => setConfig({ ...config, emailNotifications: e.target.checked })}
          />
          Email Notifications
        </label>
        <label>
          <input 
            type="checkbox" 
            checked={config.autoApproval}
            onChange={(e) => setConfig({ ...config, autoApproval: e.target.checked })}
          />
          Auto Approval for New Users
        </label>
        <button onClick={handleConfigUpdate}>Save Configuration</button>
      </div>
    </div>
  );
};

export default SystemConfiguration;
