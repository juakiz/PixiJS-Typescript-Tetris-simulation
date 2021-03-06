import * as PIXI from "pixi.js";
import { ShapeData, shapes, colors, } from '../services/globals';
import Board from "./board";
export default class Shape extends PIXI.Graphics {
  matrix: number[][];
  color: number;
  matrixPos: PIXI.Point;

  parent: Board;

  constructor(parent: Board, shapeData: ShapeData) {
    super();
    parent.addChild(this);

    const { typ, rot, pos } = shapeData;

    this.parent = parent;

    this.matrix = shapes[typ];
    this.matrixPos = new PIXI.Point(pos, 0);
    this.color = colors[typ];

    if (rot !== 0) {
      const clockwise = (rot !== 0 && rot > 1);
      const rotations = Math.abs(rot);
      for (let i = 0; i < rotations; i++) {
        const matrix = this.rotateMatrix(this.matrix, clockwise);
        this.matrix = matrix;
      }
    }

    const validPosition = parent.validatePosition(this.matrixPos, this.matrix);
    // Due to only 3-width-grid if initial position is not valid it will just go to middle
    if (!validPosition) {
      this.matrixPos.x = 0;
      const validSpawn = parent.validatePosition(this.matrixPos, this.matrix);
      if (!validSpawn) {
        parent.gameover = true;
      }
    }
  }

  private rotateMatrix(shape: number[][], clockwise: boolean): number[][] {
    const rotatedShape: number[][] = [];
    const n = shape.length;
    for (let i = 0; i < n; ++i) {
      rotatedShape[i] = [];
      for (let j = 0; j < n; ++j) {
        if (clockwise)
          rotatedShape[i][j] = shape[n - j - 1][i];
        else
          rotatedShape[i][j] = shape[j][n - i - 1];
      }
    }
    return rotatedShape;
  }

  draw(): void {
    const { cellSize, boardOffset } = this.parent
    const { matrix, matrixPos, color } = this;

    this.clear();
    matrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 1) {
          this.lineStyle(5, 0x303030, 1);
          this.beginFill(color);
          this.drawRect(
            matrixPos.x * cellSize + boardOffset.x + j * cellSize,
            matrixPos.y * cellSize + boardOffset.y + i * cellSize,
            cellSize,
            cellSize
          );
          this.endFill();
        }
      });
    });
  }

  fall(): void {
    this.matrixPos.y += 1;
  }

  move(direction: number): void {
    // console.log("moved to: " + direction);
    const newPos = new PIXI.Point(this.matrixPos.x + direction, this.matrixPos.y);
    const valid = this.parent.validatePosition(newPos, this.matrix);
    if (valid) {
      this.matrixPos.x += direction;
      this.draw();
    }
  }

  rotate(clockwise: boolean): void {
    // console.log("rotated clockwise: " + clockwise);
    const newMatrix = this.rotateMatrix(this.matrix, clockwise);
    const valid = this.parent.validatePosition(this.matrixPos, newMatrix);
    if (valid) {
      this.matrix = newMatrix;
      this.draw();
    }
  }
}

