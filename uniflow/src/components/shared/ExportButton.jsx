import React from 'react';

const ExportButton = ({ data, filename, format = 'pdf' }) => {
  const handleExport = () => {
    console.log(`Exporting ${filename} as ${format}`);
    // Export reports (PDF/Excel)
  };

  return (
    <div className="export-button">
      <button onClick={handleExport}>
        Export as {format.toUpperCase()}
      </button>
    </div>
  );
};

export default ExportButton;
