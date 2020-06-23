import * as PIXI from "pixi.js";
import Shape from "./shape";
import { Cell, ShapeData } from "../services/globals";

export default class Board extends PIXI.Container {
  private readonly boardWidth = 3;
  private readonly boardHeight = 12;
  private readonly boardOffset = new PIXI.Point(64, 64);
  private readonly cellSize = 64;

  private gridGraphics: PIXI.Graphics;
  private boardGraphics: PIXI.Graphics;
  private shapeGraphics: PIXI.Graphics;

  private boardMatrix: Cell[][];

  private currentShape!: Shape;

  shapeFalling = false;
  removingRows = false;

  constructor(parent: PIXI.Container) {
    super();
    parent.addChild(this);

    this.gridGraphics = new PIXI.Graphics;
    this.addChild(this.gridGraphics);
    this.boardGraphics = new PIXI.Graphics;
    this.addChild(this.boardGraphics);
    this.shapeGraphics = new PIXI.Graphics;
    this.addChild(this.shapeGraphics);

    this.boardMatrix = [];
    for (let i = 0; i < this.boardHeight; i++) {
      this.boardMatrix[i] = [];
      for (let j = 0; j < this.boardWidth; j++) {
        if (i === this.boardHeight)
          this.boardMatrix[i][j] = { fill: true };
        else
          this.boardMatrix[i][j] = { fill: false };
      }
    }

    this.drawGrid();
  }

  private drawGrid(): void {
    const { gridGraphics, cellSize, boardOffset } = this;

    gridGraphics.lineStyle(5, 0x000, 1);
    for (let i = 0; i <= this.boardHeight; i++) {
      gridGraphics.moveTo(boardOffset.x, boardOffset.y + cellSize * i);
      gridGraphics.lineTo(boardOffset.x + cellSize * 3, boardOffset.y + cellSize * i);
    }
    for (let i = 0; i <= this.boardWidth; i++) {
      gridGraphics.moveTo(boardOffset.x + cellSize * i, boardOffset.y);
      gridGraphics.lineTo(boardOffset.x + cellSize * i, boardOffset.y + cellSize * 12);
    }
    gridGraphics.endFill();
    gridGraphics.cacheAsBitmap = true;
  }

  private drawBoard(): void {
    const { boardGraphics, cellSize, boardOffset } = this;

    boardGraphics.clear();
    this.boardMatrix.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.fill) {
          boardGraphics.lineStyle(5, 0x303030, 1);
          boardGraphics.beginFill(cell.color);
          boardGraphics.drawRect(
            boardOffset.x + j * cellSize,
            boardOffset.y + i * cellSize,
            cellSize,
            cellSize
          );
          boardGraphics.endFill();
        }
      });
    });
  }

  addShape(shapeData: ShapeData): void {
    this.shapeFalling = true;

    this.currentShape = new Shape(this, shapeData);
  }

  integrateShape(shape: Shape): void {
    const { matrix, matrixPos } = shape;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < this.boardWidth; j++) {
        if (matrix[i][j] === 1) {
          this.boardMatrix[matrixPos.y + i][matrixPos.x + j] = { fill: true, color: shape.color };
        }
      }
    }
  }

  fallShape(): void {
    const valid = this.validatePosition(new PIXI.Point(this.currentShape.matrixPos.x, this.currentShape.matrixPos.y + 1));
    if (!valid) {
      this.integrateShape(this.currentShape);
      this.shapeFalling = false;
      this.currentShape.destroy();
      delete this.currentShape;
    } else {
      this.currentShape.fall();
    }
  }

  validatePosition(position: PIXI.Point, shape: Shape = this.currentShape): boolean {
    let valid = true;
    const n = shape.matrix.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const currentShapeCell = shape.matrix[i][j];
        if (typeof this.boardMatrix[i + position.y] === "undefined") {
          valid = false;
        } else {
          const nextBoardCell = this.boardMatrix[i + position.y][j + position.x];
          if (currentShapeCell === 1 && (typeof nextBoardCell === "undefined" || nextBoardCell.fill))
            valid = false;
        }
      }
    }
    return valid;
  }

  draw(): void {
    this.drawBoard();
    if (typeof this.currentShape !== "undefined")
      this.currentShape.draw(this.cellSize, this.boardOffset);
  }
}
