import * as PIXI from "pixi.js";
import RLC from "../services/responsive-layout-calculator";
import Board from "./board";
import data from '../services/shape-list.json';
import { ShapeData } from '../services/globals';

export default class MainBox extends PIXI.Container {
  private app: PIXI.Application;
  private board: Board;
  private jsonData: ShapeData[];

  private gameUpdateInterval: NodeJS.Timeout;
  private readonly timeInterval = 300;

  constructor(parent: PIXI.Container, app: PIXI.Application) {
    super();
    parent.addChild(this);

    this.app = app;

    this.board = new Board(this);

    console.log(data);

    this.jsonData = data.list;

    this.gameUpdateInterval = setInterval(this.gameUpdate.bind(this), this.timeInterval);
  }

  public onResize(): void {
    this.scale.x = this.scale.y = RLC.SCALE;
    this.x = (RLC.SCREEN_WIDTH - (RLC.BOX_WIDTH * RLC.SCALE)) / 2;
    this.y = (RLC.SCREEN_HEIGHT - RLC.BOX_HEIGHT * RLC.SCALE) / 2;
  }

  public update(): void {
    console.log();
  }

  private gameUpdate(): void {
    if (this.board.shapeFalling) {
      this.board.fallShape();
    } else if (this.board.removingRows) {

    } else {
      const shapeData = this.jsonData.shift();
      if (typeof shapeData !== "undefined") {
        this.board.addShape(shapeData);
      } else {
        clearInterval(this.gameUpdateInterval);
        console.log("GAME OVER");
      }
    }
    this.board.draw();
  }
}
