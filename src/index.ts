import * as PIXI from "pixi.js";
import RLC from './services/responsive-layout-calculator';
import MainBox from './game/main-box';

// import rabbitImage from "./assets/rabbit.png";

export class Main {
  private app!: PIXI.Application;
  public mainBox!: MainBox;

  constructor() {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    window.onload = (): void => {
      this.startLoadingAssets();
    };
  }

  public helloWorld(): string {
    return "hello world";
  }

  private startLoadingAssets(): void {
    const loader = PIXI.Loader.shared;
    // loader.add("rabbit", rabbitImage);

    loader.on("complete", () => {
      this.onAssetsLoaded();
    });
    loader.load();
  }

  private onAssetsLoaded(): void {
    this.createRenderer();

    this.app.ticker.add(() => {
      this.mainBox.update();
    });
  }

  private createRenderer(): void {

    this.app = new PIXI.Application({
      backgroundColor: 0xffffff,
      width: RLC.SCREEN_WIDTH,
      height: RLC.SCREEN_HEIGHT,
    });

    document.body.appendChild(this.app.view);

    this.mainBox = new MainBox(this.app.stage, this.app);

    this.onResize.call(this);

    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize(): void {
    if (!this.app) {
      return;
    }

    RLC.resize();
    this.app.renderer.resize(RLC.SCREEN_WIDTH, RLC.SCREEN_HEIGHT);
    this.mainBox.onResize.call(this.mainBox);
  }
}

new Main();
