import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { COLOR_MAP } from '../utils/cubeLogic';
import * as THREE from 'three';

const Face = ({ colors, position, rotation }) => {
  // colors is an array of 9 color codes
  // We render 9 planes
  // Grid is 3x3. Local coordinates: -1, 0, 1

  return (
    <group position={position} rotation={rotation}>
      {colors.map((colorCode, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;
        // x: col - 1 ( -1, 0, 1 )
        // y: 1 - row ( 1, 0, -1 )
        return (
          <mesh key={i} position={[col - 1, 1 - row, 0]}>
            <planeGeometry args={[0.95, 0.95]} />
            <meshStandardMaterial color={COLOR_MAP[colorCode]} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* Black background for the face to simulate gaps */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3, 3]} />
        <meshBasicMaterial color="black" />
      </mesh>
    </group>
  );
};

const Cube3D = ({ cubeState }) => {
  // cubeState is array of 54 chars
  // U: 0-8, R: 9-17, F: 18-26, D: 27-35, L: 36-44, B: 45-53

  const U = cubeState.slice(0, 9);
  const R = cubeState.slice(9, 18);
  const F = cubeState.slice(18, 27);
  const D = cubeState.slice(27, 36);
  const L = cubeState.slice(36, 45);
  const B = cubeState.slice(45, 54);

  return (
    <Canvas camera={{ position: [7, 7, 7], fov: 45 }} style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      <OrbitControls enableZoom={true} enablePan={true} />

      {/* U Face (Up) - y=1.5, facing up */}
      <Face colors={U} position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} />

      {/* D Face (Down) - y=-1.5, facing down */}
      <Face colors={D} position={[0, -1.5, 0]} rotation={[Math.PI / 2, 0, 0]} />

      {/* F Face (Front) - z=1.5, facing front */}
      <Face colors={F} position={[0, 0, 1.5]} rotation={[0, 0, 0]} />

      {/* B Face (Back) - z=-1.5, facing back */}
      <Face colors={B} position={[0, 0, -1.5]} rotation={[0, Math.PI, 0]} />

      {/* L Face (Left) - x=-1.5, facing left */}
      <Face colors={L} position={[-1.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* R Face (Right) - x=1.5, facing right */}
      <Face colors={R} position={[1.5, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Inner core (black box) */}
      <mesh>
        <boxGeometry args={[2.9, 2.9, 2.9]} />
        <meshBasicMaterial color="black" />
      </mesh>
    </Canvas>
  );
};

export default Cube3D;
