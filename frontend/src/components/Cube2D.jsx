import React from 'react';
import { COLOR_MAP } from '../utils/cubeLogic';
import './Cube2D.css';

const Face2D = ({ colors, label }) => {
  return (
    <div className="face-2d">
      <div className="face-label">{label}</div>
      <div className="face-grid">
        {colors.map((colorCode, i) => (
          <div
            key={i}
            className="face-cell"
            style={{ backgroundColor: COLOR_MAP[colorCode] }}
          />
        ))}
      </div>
    </div>
  );
};

const Cube2D = ({ cubeState }) => {
  // cubeState is array of 54 chars
  // U: 0-8, R: 9-17, F: 18-26, D: 27-35, L: 36-44, B: 45-53

  const U = cubeState.slice(0, 9);
  const R = cubeState.slice(9, 18);
  const F = cubeState.slice(18, 27);
  const D = cubeState.slice(27, 36);
  const L = cubeState.slice(36, 45);
  const B = cubeState.slice(45, 54);

  return (
    <div className="cube-2d-container">
      <div className="cube-2d-layout">
        {/* Top row - Up face */}
        <div className="row-top">
          <div className="spacer"></div>
          <Face2D colors={U} label="U" />
          <div className="spacer"></div>
          <div className="spacer"></div>
        </div>

        {/* Middle row - Left, Front, Right, Back */}
        <div className="row-middle">
          <Face2D colors={L} label="L" />
          <Face2D colors={F} label="F" />
          <Face2D colors={R} label="R" />
          <Face2D colors={B} label="B" />
        </div>

        {/* Bottom row - Down face */}
        <div className="row-bottom">
          <div className="spacer"></div>
          <Face2D colors={D} label="D" />
          <div className="spacer"></div>
          <div className="spacer"></div>
        </div>
      </div>
    </div>
  );
};

export default Cube2D;
