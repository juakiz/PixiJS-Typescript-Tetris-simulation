import * as PIXI from "pixi.js";
import Shape from "./shape";
import { Cell, ShapeData } from "../services/globals";
import RLC from "../services/responsive-layout-calculator";
import MainBox from "./main-box";

export default class Board extends PIXI.Container {
  private readonly boardWidth = 3;
  private readonly boardHeight = 12;
  readonly boardOffset = new PIXI.Point(RLC.BOX_WIDTH - 256, 128);
  readonly cellSize = 64;

  private gridGraphics = new PIXI.Graphics;
  private boardGraphics = new PIXI.Graphics;
  private shapeGraphics = new PIXI.Graphics;

  private boardMatrix: Cell[][];

  currentShape!: Shape;

  private fullRows: number[] = [];

  shapeFalling = false;
  removingRows = false;

  gameover = false;

  parent: MainBox;

  constructor(parent: MainBox) {
    super();
    parent.addChild(this);
    this.parent = parent;

    this.addChild(this.gridGraphics);
    this.addChild(this.boardGraphics);
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

      this.fullRows = this.checkFullRows();
      if (this.fullRows.length > 0) {
        this.removingRows = true;
        this.removeRows();
      }
    } else {
      this.currentShape.fall();
    }
  }

  checkFullRows(): number[] {
    const fullRows = [];
    let count;
    for (let i = 0; i < this.boardMatrix.length; i++) {
      count = 0;
      for (let j = 0; j < this.boardMatrix[i].length; j++) {
        if (this.boardMatrix[i][j].fill) {
          count++;
        }
      }
      if (count === this.boardMatrix[i].length) {
        fullRows.push(i);
      }
    }

    return fullRows;
  }

  removeRows(): void {
    const rows = this.fullRows;
    rows.forEach(row => {
      this.boardMatrix[row].forEach(cell => {
        cell.fill = false;
        delete cell.color;
      });
      this.parent.changeScore();
    });
  }

  fallBoardcells(): void {
    const rows = this.fullRows;
    rows.forEach(row => {
      for (let i = row; i > 0; i--) {
        for (let j = 0; j < 3; j++) {
          this.boardMatrix[i][j].fill = this.boardMatrix[i - 1][j].fill;
          this.boardMatrix[i][j].color = this.boardMatrix[i - 1][j].color;
          this.boardMatrix[i - 1][j].fill = false;
          delete this.boardMatrix[i - 1][j].color;
        }
      }
    });
    this.removingRows = false;
  }

  validatePosition(position: PIXI.Point, matrix: number[][] = this.currentShape.matrix): boolean {
    let valid = true;
    const n = matrix.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const currentShapeCell = matrix[i][j];
        if (currentShapeCell === 1) {
          const nextBoardRow = this.boardMatrix[i + position.y];
          if (typeof nextBoardRow === "undefined") {
            valid = false;
          } else {
            const nextBoardCell = nextBoardRow[j + position.x];
            if (typeof nextBoardCell === "undefined" || nextBoardCell.fill)
              valid = false;
          }
        }
      }
    }
    return valid;
  }

  draw(): void {
    this.drawBoard();
    if (typeof this.currentShape !== "undefined")
      this.currentShape.draw();
  }
}
