import * as PIXI from "pixi.js";
import data from './services/shape-list.json';
import RLC from './services/responsive-layout-calculator';

import rabbitImage from "./assets/rabbit.png";

export class Main {
  private app!: PIXI.Application;
  public mainBox!: PIXI.Container;

  constructor() {
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    window.onload = (): void => {
      this.startLoadingAssets();
    };

  }

  // add for the test example purpose
  public helloWorld(): string {
    return "hello world";
  }

  private startLoadingAssets(): void {
    const loader = PIXI.Loader.shared;
    loader.add("rabbit", rabbitImage);
    loader.add("spriteExample", "./assets/spriteSheets/spritesData.json"); // example of loading spriteSheet

    loader.on("complete", () => {
      this.onAssetsLoaded();
    });
    //
    loader.load();
  }

  private onAssetsLoaded(): void {
    this.createRenderer();

    const { mainBox } = this;

    const bunny = this.getBunny();
    bunny.position.set(RLC.CENTER_X, RLC.CENTER_Y);

    const birdFromSprite = this.getBird();
    birdFromSprite.anchor.set(0.5, 0.5);
    birdFromSprite.position.set(RLC.CENTER_X, RLC.CENTER_Y + bunny.height);

    mainBox.addChild(bunny);
    mainBox.addChild(birdFromSprite);

    const text1 = new PIXI.Text("hello world", {
      fontFamily: "Press Start 2P",
      fontSize: "32px",
      fill: "black",
    });
    text1.x = 30;
    text1.y = 30;
    mainBox.addChild(text1);

    this.app.ticker.add(() => {
      // bunny.rotation += 0.05;
    });

    console.log(data);
  }

  private createRenderer(): void {

    this.app = new PIXI.Application({
      backgroundColor: 0xffffff,
      width: RLC.SCREEN_WIDTH,
      height: RLC.SCREEN_HEIGHT,
    });

    document.body.appendChild(this.app.view);

    this.mainBox = new PIXI.Container();
    this.app.stage.addChild(this.mainBox);
    this.onResize.call(this);

    window.addEventListener("resize", this.onResize.bind(this));
  }

  private onResize(): void {
    if (!this.app) {
      return;
    }

    RLC.resize();

    this.app.renderer.resize(RLC.SCREEN_WIDTH, RLC.SCREEN_HEIGHT);

    this.mainBox.scale.x = this.mainBox.scale.y = RLC.SCALE;
    this.mainBox.x = (RLC.SCREEN_WIDTH - (RLC.BOX_WIDTH * RLC.SCALE)) / 2;
    this.mainBox.y = (RLC.SCREEN_HEIGHT - RLC.BOX_HEIGHT * RLC.SCALE) / 2;
  }

  private getBunny(): PIXI.Sprite {
    const bunnyRotationPoint = {
      x: 0.5,
      y: 0.5,
    };

    const bunny = new PIXI.Sprite(PIXI.Texture.from("rabbit"));
    bunny.anchor.set(bunnyRotationPoint.x, bunnyRotationPoint.y);
    bunny.scale.set(5, 5);

    return bunny;
  }

  private getBird(): PIXI.AnimatedSprite {
    const bird = new PIXI.AnimatedSprite([
      PIXI.Texture.from("birdUp.png"),
      PIXI.Texture.from("birdMiddle.png"),
      PIXI.Texture.from("birdDown.png"),
    ]);
    bird.loop = true;
    bird.animationSpeed = 0.1;
    bird.play();
    bird.scale.set(3);

    return bird;
  }
}

new Main();
