import React, { useState, useEffect } from 'react';
import Cube3D from './components/Cube3D';
import Cube2D from './components/Cube2D';
import CubeScanner from './components/CubeScanner';
import { SOLVED_STATE, applyMove, generateShuffle, getInverseMove } from './utils/cubeLogic';
import './App.css';

function App() {
  const [cubeState, setCubeState] = useState(SOLVED_STATE);
  const [solution, setSolution] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSolving, setIsSolving] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const [error, setError] = useState(null);

  const handleShuffle = () => {
    const moves = generateShuffle();
    let newState = [...cubeState];
    moves.forEach(move => {
      newState = applyMove(newState, move);
    });
    setCubeState(newState);
    setSolution([]);
    setCurrentStep(0);
    setError(null);
  };

  const handleReset = () => {
    setCubeState(SOLVED_STATE);
    setSolution([]);
    setCurrentStep(0);
    setError(null);
  };

  const handleScanComplete = (definition) => {
    // definition is a string of 54 chars
    setCubeState(definition.split(''));
    setIsScanning(false);
    setSolution([]);
    setCurrentStep(0);
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setError(null);
    try {
      const definition = cubeState.join('');
      const response = await fetch('https://rubicqube.onrender.com/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ definition }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to solve');
      }

      const data = await response.json();
      setSolution(data.steps);
      setCurrentStep(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSolving(false);
    }
  };

  const handleNext = () => {
    if (currentStep < solution.length) {
      const move = solution[currentStep];
      setCubeState(prev => applyMove(prev, move));
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      const move = solution[currentStep - 1];
      const inverseMove = getInverseMove(move);
      setCubeState(prev => applyMove(prev, inverseMove));
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAutoSolve = () => {
    setIsAutoSolving(true);
  };

  const handleStopAutoSolve = () => {
    setIsAutoSolving(false);
  };

  // Auto-solve effect - applies moves automatically
  useEffect(() => {
    if (isAutoSolving && currentStep < solution.length) {
      const timer = setTimeout(() => {
        const move = solution[currentStep];
        setCubeState(prev => applyMove(prev, move));
        setCurrentStep(prev => prev + 1);
      }, 500); // 500ms delay between moves

      return () => clearTimeout(timer);
    } else if (isAutoSolving && currentStep >= solution.length) {
      // Auto-solve complete
      setIsAutoSolving(false);
    }
  }, [isAutoSolving, currentStep, solution]);

  return (
    <div className="app-container">
      {isScanning && (
        <CubeScanner
          onScanComplete={handleScanComplete}
          onCancel={() => setIsScanning(false)}
        />
      )}

      <div className="controls-panel">
        <h1>AI Rubik's Cube Solver</h1>
        <div className="buttons">
          <button onClick={() => setIsScanning(true)} disabled={isSolving || isAutoSolving}>Scan Real Cube (AI Vision)</button>
          <button onClick={handleShuffle} disabled={isSolving || isAutoSolving}>Shuffle</button>
          <button onClick={handleReset} disabled={isSolving || isAutoSolving}>Reset</button>
          <button onClick={handleSolve} disabled={isSolving || solution.length > 0 || isAutoSolving}>
            {isSolving ? 'Solving...' : 'Solve with AI'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}

        {solution.length > 0 && (
          <div className="solution-controls">
            <h3>Solution ({solution.length} steps)</h3>
            <div className="step-display">
              Step {currentStep} / {solution.length}
            </div>

            {!isAutoSolving ? (
              <>
                <button
                  onClick={handleAutoSolve}
                  disabled={currentStep >= solution.length}
                  className="auto-solve-btn"
                >
                  🚀 Auto Solve
                </button>
                <div className="step-buttons">
                  <button onClick={handlePrev} disabled={currentStep === 0}>Previous</button>
                  <button onClick={handleNext} disabled={currentStep === solution.length}>Next</button>
                </div>
              </>
            ) : (
              <button onClick={handleStopAutoSolve} className="stop-btn">
                ⏸️ Stop Auto Solve
              </button>
            )}

            <div className="next-move">
              {currentStep < solution.length ? (
                <>Current Move: <strong>{solution[currentStep]}</strong></>
              ) : (
                <span style={{ color: '#4ade80' }}>✓ Solved!</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="cube-container">
        <div className="visualization-wrapper">
          <div className="cube-3d-section">
            <h2 className="viz-title">Interactive 3D View</h2>
            <div className="canvas-wrapper">
              <Cube3D cubeState={cubeState} />
            </div>
            <p className="hint-text">💡 Drag to rotate • Scroll to zoom • Right-click to pan</p>
          </div>
          <div className="cube-2d-section">
            <h2 className="viz-title">2D Unfolded View</h2>
            <Cube2D cubeState={cubeState} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
