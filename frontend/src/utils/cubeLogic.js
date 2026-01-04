// Initial solved state
// U: White, R: Red, F: Green, D: Yellow, L: Orange, B: Blue
export const SOLVED_STATE = [
  ...Array(9).fill('U'), // Up (White)
  ...Array(9).fill('R'), // Right (Red)
  ...Array(9).fill('F'), // Front (Green)
  ...Array(9).fill('D'), // Down (Yellow)
  ...Array(9).fill('L'), // Left (Orange)
  ...Array(9).fill('B'), // Back (Blue)
];

export const COLOR_MAP = {
  'U': '#ffffff', // White
  'R': '#b90000', // Red
  'F': '#009b48', // Green
  'D': '#ffd500', // Yellow
  'L': '#ff5800', // Orange
  'B': '#0045ad', // Blue
};

// Indices for each face
// U: 0-8
// R: 9-17
// F: 18-26
// D: 27-35
// L: 36-44
// B: 45-53

// Helper to rotate a face (clockwise)
// A face has indices 0-8.
// 0 1 2
// 3 4 5
// 6 7 8
// Rotated:
// 6 3 0
// 7 4 1
// 8 5 2
const rotateFace = (face) => {
  return [
    face[6], face[3], face[0],
    face[7], face[4], face[1],
    face[8], face[5], face[2]
  ];
};

export const applyMove = (state, move) => {
  let newState = [...state];

  // Extract faces
  let U = newState.slice(0, 9);
  let R = newState.slice(9, 18);
  let F = newState.slice(18, 27);
  let D = newState.slice(27, 36);
  let L = newState.slice(36, 45);
  let B = newState.slice(45, 54);

  const baseMove = move.replace("'", "").replace("2", "");
  const isPrime = move.includes("'");
  const isDouble = move.includes("2");

  const times = isDouble ? 2 : (isPrime ? 3 : 1);

  for (let i = 0; i < times; i++) {
    if (baseMove === 'U') {
      // Rotate U face
      U = rotateFace(U);
      // Rotate sides: F -> L -> B -> R -> F
      // Top row of F, L, B, R
      const temp = [F[0], F[1], F[2]];
      F[0] = R[0]; F[1] = R[1]; F[2] = R[2];
      R[0] = B[0]; R[1] = B[1]; R[2] = B[2];
      B[0] = L[0]; B[1] = L[1]; B[2] = L[2];
      L[0] = temp[0]; L[1] = temp[1]; L[2] = temp[2];
    } else if (baseMove === 'D') {
      // Rotate D face
      D = rotateFace(D);
      // Rotate sides: F -> R -> B -> L -> F
      // Bottom row: 6, 7, 8
      const temp = [F[6], F[7], F[8]];
      F[6] = L[6]; F[7] = L[7]; F[8] = L[8];
      L[6] = B[6]; L[7] = B[7]; L[8] = B[8];
      B[6] = R[6]; B[7] = R[7]; B[8] = R[8];
      R[6] = temp[0]; R[7] = temp[1]; R[8] = temp[2];
    } else if (baseMove === 'F') {
      F = rotateFace(F);
      // U -> R -> D -> L -> U
      // U bottom (6,7,8) -> R left (0,3,6) -> D top (2,1,0) -> L right (8,5,2)

      const temp2 = [U[6], U[7], U[8]];
      U[6] = L[8]; U[7] = L[5]; U[8] = L[2];
      L[2] = D[0]; L[5] = D[1]; L[8] = D[2];
      D[0] = R[6]; D[1] = R[3]; D[2] = R[0];
      R[0] = temp2[0]; R[3] = temp2[1]; R[6] = temp2[2];

    } else if (baseMove === 'B') {
      B = rotateFace(B);
      // U -> L -> D -> R -> U
      // U top (0,1,2) -> L left (0,3,6) -> D bottom (6,7,8) -> R right (2,5,8)

      const temp = [U[0], U[1], U[2]];
      U[0] = R[2]; U[1] = R[5]; U[2] = R[8];
      R[2] = D[8]; R[5] = D[7]; R[8] = D[6];
      D[6] = L[0]; D[7] = L[3]; D[8] = L[6];
      L[0] = temp[2]; L[3] = temp[1]; L[6] = temp[0];

    } else if (baseMove === 'L') {
      L = rotateFace(L);
      // U -> F -> D -> B -> U
      // Left col of U, F, D, B
      // U[0,3,6] -> F[0,3,6] -> D[0,3,6] -> B[8,5,2] (B is reversed because it's on the back)

      const temp = [U[0], U[3], U[6]];
      U[0] = B[8]; U[3] = B[5]; U[6] = B[2];
      B[2] = D[6]; B[5] = D[3]; B[8] = D[0];
      D[0] = F[0]; D[3] = F[3]; D[6] = F[6];
      F[0] = temp[0]; F[3] = temp[1]; F[6] = temp[2];

    } else if (baseMove === 'R') {
      R = rotateFace(R);
      // U -> B -> D -> F -> U
      // Right col
      // U[2,5,8] -> B[6,3,0] -> D[2,5,8] -> F[2,5,8]

      const temp = [U[2], U[5], U[8]];
      U[2] = F[2]; U[5] = F[5]; U[8] = F[8];
      F[2] = D[2]; F[5] = D[5]; F[8] = D[8];
      D[2] = B[6]; D[5] = B[3]; D[8] = B[0];
      B[0] = temp[2]; B[3] = temp[1]; B[6] = temp[0];
    }
  }

  // Reassemble
  return [...U, ...R, ...F, ...D, ...L, ...B];
};

export const getInverseMove = (move) => {
  if (move.includes("2")) return move;
  if (move.includes("'")) return move.replace("'", "");
  return move + "'";
};

export const generateShuffle = (length = 20) => {
  const moves = ['U', 'D', 'L', 'R', 'F', 'B'];
  const modifiers = ['', "'", '2'];
  let shuffleSequence = [];
  for (let i = 0; i < length; i++) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    const mod = modifiers[Math.floor(Math.random() * modifiers.length)];
    shuffleSequence.push(move + mod);
  }
  return shuffleSequence;
};
