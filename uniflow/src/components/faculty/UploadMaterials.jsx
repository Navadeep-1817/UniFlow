import React, { useState, useEffect } from 'react';

const UploadMaterials = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [materials, setMaterials] = useState([]);

  const handleUpload = (file) => {
    console.log('Uploading material:', file);
    // Upload session notes/PPTs
  };

  return (
    <div className="upload-materials">
      <h2>Upload Session Materials</h2>
      <select onChange={(e) => setSelectedSession(e.target.value)}>
        <option value="">Select Session</option>
        {sessions.map(session => (
          <option key={session.id} value={session.id}>
            {session.title} - {session.date}
          </option>
        ))}
      </select>
      {selectedSession && (
        <div className="upload-section">
          <div className="upload-form">
            <input type="file" multiple accept=".pdf,.ppt,.pptx,.doc,.docx" />
            <button onClick={handleUpload}>Upload</button>
          </div>
          <div className="uploaded-materials">
            <h3>Uploaded Materials</h3>
            <table>
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {materials.map(material => (
                  <tr key={material.id}>
                    <td>{material.fileName}</td>
                    <td>{material.type}</td>
                    <td>{material.size}</td>
                    <td>{material.uploadedOn}</td>
                    <td>
                      <button>Download</button>
                      <button>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMaterials;
