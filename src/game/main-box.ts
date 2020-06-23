import * as PIXI from "pixi.js";
import RLC from "../services/responsive-layout-calculator";
import Board from "./board";
import data from '../services/shape-list.json';
import { ShapeData } from '../services/globals';
import keyboard from "../lib/keyboard";

export default class MainBox extends PIXI.Container {
  private app: PIXI.Application;
  private board: Board;
  private jsonData: ShapeData[];

  private gameUpdateInterval: NodeJS.Timeout;
  private readonly timeInterval = 450;

  private score = 0;
  private scoreTxt: PIXI.Text;
  private infoTxt: PIXI.Text;

  constructor(parent: PIXI.Container, app: PIXI.Application) {
    super();
    parent.addChild(this);

    this.app = app;

    this.board = new Board(this);

    // console.log(data);

    this.jsonData = data.list;

    const title = new PIXI.Text('Tetris Simulation', {
      fontFamily: 'Press Start 2P',
      fontSize: 56,
      fill: 0x000,
      align: 'center',
    });
    title.position.set(512, 64);
    title.anchor.set(0.5);
    this.addChild(title);

    this.scoreTxt = this.createScoreText();
    this.infoTxt = this.createInfoText();

    this.gameUpdateInterval = setInterval(this.gameUpdate.bind(this), this.timeInterval);

    keyboard("ArrowLeft").press = (): void => {
      if (typeof this.board.currentShape !== "undefined")
        this.board.currentShape.move(-1);
    };
    keyboard("ArrowRight").press = (): void => {
      if (typeof this.board.currentShape !== "undefined")
        this.board.currentShape.move(1);
    };
    keyboard("a").press = (): void => {
      if (typeof this.board.currentShape !== "undefined")
        this.board.currentShape.rotate(false);
    };
    keyboard("d").press = (): void => {
      if (typeof this.board.currentShape !== "undefined")
        this.board.currentShape.rotate(true);
    };
    keyboard("ArrowDown").press = (): void => {
      if (typeof this.board.currentShape !== "undefined") {
        this.gameUpdate.call(this)
        this.gameUpdateInterval = setInterval(this.gameUpdate.bind(this), this.timeInterval);
        clearInterval(this.gameUpdateInterval);
      }
    };
  }

  createScoreText(): PIXI.Text {
    const txt = new PIXI.Text('Score: ' + this.score, {
      fontFamily: 'Press Start 2P',
      fontSize: 30,
      fill: 0x000,
      align: 'center',
    });
    txt.position.set(256 + 128, 256);
    txt.anchor.set(0.5);
    this.addChild(txt);
    return txt;
  }

  changeScore(): void {
    this.score += 10;
    this.scoreTxt.text = 'Score: ' + this.score;
  }

  createInfoText(): PIXI.Text {
    const initialText =
      `Press right-left to move,
A to rotate left,
D to rotate right
and down to fall faster.`;
    const txt = new PIXI.Text(initialText, {
      fontFamily: 'Press Start 2P',
      fontSize: 30,
      fill: 0x000,
      align: 'center',
    });
    txt.position.set(256 + 128, 512);
    txt.anchor.set(0.5);
    this.addChild(txt);
    return txt;
  }

  changeInfoText(newText: string): void {
    this.infoTxt.text = newText;
    this.infoTxt.scale.set(1.3);
  }

  onResize(): void {
    this.scale.x = this.scale.y = RLC.SCALE;
    this.x = (RLC.SCREEN_WIDTH - (RLC.BOX_WIDTH * RLC.SCALE)) / 2;
    this.y = (RLC.SCREEN_HEIGHT - RLC.BOX_HEIGHT * RLC.SCALE) / 2;
  }

  update(): void {
    console.log();
  }

  private gameUpdate(): void {
    if (this.board.gameover) {
      clearInterval(this.gameUpdateInterval);
      this.changeInfoText("Game Over");
      // console.log("Game Over");
    } else {
      if (this.board.shapeFalling) {
        this.board.fallShape();
      } else if (this.board.removingRows) {
        this.board.fallBoardcells();
      } else {
        const shapeData = this.jsonData.shift();
        if (typeof shapeData !== "undefined") {
          this.board.addShape(shapeData);
        } else {
          clearInterval(this.gameUpdateInterval);
          // console.log("No More Shapes");
          this.changeInfoText("No More Shapes");
        }
      }
      this.board.draw();
    }
  }
}
