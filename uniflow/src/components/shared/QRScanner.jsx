import React, { useState } from 'react';

const QRScanner = ({ onScan }) => {
  const [scanning, setScanning] = useState(false);

  const handleStartScan = () => {
    setScanning(true);
    // Initialize QR scanner
    console.log('Starting QR scan...');
  };

  const handleStopScan = () => {
    setScanning(false);
    console.log('Stopping QR scan...');
  };

  return (
    <div className="qr-scanner">
      {!scanning ? (
        <button onClick={handleStartScan}>Start QR Scanner</button>
      ) : (
        <>
          <div className="scanner-view">
            {/* QR Scanner Camera View */}
            <p>Scanning for QR code...</p>
          </div>
          <button onClick={handleStopScan}>Stop Scanner</button>
        </>
      )}
    </div>
  );
};

export default QRScanner;
