
export default class RLC {
  // Letterbox Container size here:
  static BOX_WIDTH = 1024;
  static BOX_HEIGHT = 1024;
  
  static SCREEN_WIDTH: number;
  static SCREEN_HEIGHT: number;

  static CENTER_X: number;
  static CENTER_Y: number;

  static SCALE: number;

  static LEFT: number;
  static TOP: number;
  static BOT: number;
  static RIGHT: number;

  static TOTAL_WIDTH: number;
  static TOTAL_HEIGHT: number;

  constructor() {
    throw new Error('AbstractClassError');
  }

  static resize(): void {

    RLC.SCREEN_WIDTH = window.innerWidth;
    RLC.SCREEN_HEIGHT = window.innerHeight;

    // Letterbox CAMERA calculations
    const SCALE_WIDTH = RLC.SCREEN_WIDTH / RLC.BOX_WIDTH;
    const SCALE_HEIGHT = RLC.SCREEN_HEIGHT / RLC.BOX_HEIGHT;

    RLC.SCALE = (SCALE_WIDTH < SCALE_HEIGHT) ? SCALE_WIDTH : SCALE_HEIGHT;
    const INVS = 1 / RLC.SCALE;

    RLC.CENTER_X = RLC.BOX_WIDTH / 2;
    RLC.CENTER_Y = RLC.BOX_HEIGHT / 2;

    RLC.LEFT = -((RLC.SCREEN_WIDTH / 2) - RLC.CENTER_X * RLC.SCALE) * INVS;
    RLC.RIGHT = -RLC.LEFT + RLC.BOX_WIDTH;
    RLC.TOP = -((RLC.SCREEN_HEIGHT / 2) - RLC.CENTER_Y * RLC.SCALE) * INVS;
    RLC.BOT = -RLC.TOP + RLC.BOX_HEIGHT;

    RLC.TOTAL_WIDTH = RLC.RIGHT - RLC.LEFT;
    RLC.TOTAL_HEIGHT = RLC.BOT - RLC.TOP;
  }
}
