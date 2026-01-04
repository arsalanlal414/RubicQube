import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import './CubeScanner.css';

const FACES = ['U', 'R', 'F', 'D', 'L', 'B'];
const FACE_NAMES = {
  'U': 'Up (White)',
  'R': 'Right (Red)',
  'F': 'Front (Green)',
  'D': 'Down (Yellow)',
  'L': 'Left (Orange)',
  'B': 'Back (Blue)'
};

const CubeScanner = ({ onScanComplete, onCancel }) => {
  const webcamRef = useRef(null);
  const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
  const [scannedColors, setScannedColors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const capture = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('https://rubicqube.onrender.com/scan-face', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageSrc }),
      });

      if (!response.ok) {
        throw new Error('Failed to scan face');
      }

      const data = await response.json();
      const colors = data.colors; // Array of 9 chars

      // Save colors for current face
      const face = FACES[currentFaceIndex];
      setScannedColors(prev => ({ ...prev, [face]: colors }));

      // Move to next face or finish
      if (currentFaceIndex < FACES.length - 1) {
        setCurrentFaceIndex(prev => prev + 1);
      } else {
        // Finished
        const finalState = { ...scannedColors, [face]: colors };
        // Flatten to string in U R F D L B order
        let definition = '';
        FACES.forEach(f => {
          definition += finalState[f].join('');
        });
        onScanComplete(definition);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  }, [webcamRef, currentFaceIndex, scannedColors, onScanComplete]);

  const currentFace = FACES[currentFaceIndex];

  return (
    <div className="scanner-overlay">
      <div className="scanner-container">
        <h2>Scan Cube Face: {FACE_NAMES[currentFace]}</h2>
        <div className="webcam-wrapper">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
            height={400}
            videoConstraints={{ facingMode: "environment" }}
          />
          <div className="overlay-grid">
            {/* 3x3 Grid Overlay to guide user */}
            {[...Array(9)].map((_, i) => (
              <div key={i} className="grid-cell"></div>
            ))}
          </div>
        </div>

        <div className="scanner-controls">
          {error && <div className="error-msg">{error}</div>}
          <button onClick={capture} disabled={isProcessing}>
            {isProcessing ? 'Scanning...' : 'Capture & Next'}
          </button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>

        <div className="instructions">
          <p>Align the {FACE_NAMES[currentFace]} face with the grid.</p>
          <p>Ensure good lighting and hold steady.</p>
        </div>
      </div>
    </div>
  );
};

export default CubeScanner;
