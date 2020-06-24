export const shapes: number[][][] = [
  // violet
  [
    [0, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  //purple
  [
    [0, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  // lime
  [
    [0, 0, 0],
    [1, 0, 1],
    [0, 1, 0],
  ],
  // yellow
  [
    [1, 0, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  // cyan
  [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  // empty
  [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]
];

export const colors: number[] = [
  0x825dc1,
  0xbb4286,
  0x9edeba,
  0xf3ea4e,
  0xaad8ef,
];

// Interfaces
export interface ShapeData {
  typ: number;
  pos: number;
  rot: number;
}

export interface Cell {
  fill: boolean;
  color?: number;
}

// export interface Shape {
//   matrix: number[][];
//   position: PIXI.Point;
//   color?: number,
// }