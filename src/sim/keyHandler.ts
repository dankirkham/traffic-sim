import Camera from "./Camera";
import CameraConfig from "./CameraConfig";

export default class KeyHandler {
  private keys: boolean[];

  static readonly KEY_UP: number = 0;
  static readonly KEY_LEFT: number = 1;
  static readonly KEY_DOWN: number = 2;
  static readonly KEY_RIGHT: number = 3;
  static readonly KEY_W: number = 4;
  static readonly KEY_A: number = 5;
  static readonly KEY_S: number = 6;
  static readonly KEY_D: number = 7;

  static readonly DIRECTION_UP: number = 0;
  static readonly DIRECTION_LEFT: number = 1;
  static readonly DIRECTION_DOWN: number = 2;
  static readonly DIRECTION_RIGHT: number = 3;

  constructor() {
    this.keys = [];
  }

  // This works and I don't really care to learn why right now.
  // http://stackoverflow.com/questions/20627138/typescript-this-scoping-issue-when-called-in-jquery-callback

  private handleKeyDown = (event) => {
    if (!event.key)
      return;

    if (event.key == 'ArrowUp') {
      this.keys[KeyHandler.KEY_UP] = true;
    } else if (event.key == 'ArrowLeft') {
      this.keys[KeyHandler.KEY_LEFT] = true;
    } else if (event.key == 'ArrowDown') {
      this.keys[KeyHandler.KEY_DOWN] = true;
    } else if (event.key == 'ArrowRight') {
      this.keys[KeyHandler.KEY_RIGHT] = true;
    } else if (event.key == 'w') {
      this.keys[KeyHandler.KEY_W] = true;
    } else if (event.key == 'a') {
      this.keys[KeyHandler.KEY_A] = true;
    } else if (event.key == 's') {
      this.keys[KeyHandler.KEY_S] = true;
    } else if (event.key == 'd') {
      this.keys[KeyHandler.KEY_D] = true;
    }
  }

  private handleKeyUp = (event) => {
    if (!event.key)
      return;

    if (event.key == 'ArrowUp') {
      this.keys[KeyHandler.KEY_UP] = false;
    } else if (event.key == 'ArrowLeft') {
      this.keys[KeyHandler.KEY_LEFT] = false;
    } else if (event.key == 'ArrowDown') {
      this.keys[KeyHandler.KEY_DOWN] = false;
    } else if (event.key == 'ArrowRight') {
      this.keys[KeyHandler.KEY_RIGHT] = false;
    } else if (event.key == 'w') {
      this.keys[KeyHandler.KEY_W] = false;
    } else if (event.key == 'a') {
      this.keys[KeyHandler.KEY_A] = false;
    } else if (event.key == 's') {
      this.keys[KeyHandler.KEY_S] = false;
    } else if (event.key == 'd') {
      this.keys[KeyHandler.KEY_D] = false;
    }
  }

  isMoving(): boolean {
    return this.keys[KeyHandler.KEY_UP] || this.keys[KeyHandler.KEY_W] ||
           this.keys[KeyHandler.KEY_LEFT] || this.keys[KeyHandler.KEY_A] ||
           this.keys[KeyHandler.KEY_DOWN] || this.keys[KeyHandler.KEY_S] ||
           this.keys[KeyHandler.KEY_RIGHT] || this.keys[KeyHandler.KEY_D];
  }

  isPressingDirection(direction: number): boolean {
    switch (direction) {
      case KeyHandler.DIRECTION_UP:
        return this.keys[KeyHandler.KEY_UP] || this.keys[KeyHandler.KEY_W];
      case KeyHandler.DIRECTION_LEFT:
        return this.keys[KeyHandler.KEY_LEFT] || this.keys[KeyHandler.KEY_A];
      case KeyHandler.DIRECTION_DOWN:
        return this.keys[KeyHandler.KEY_DOWN] || this.keys[KeyHandler.KEY_S];
      case KeyHandler.DIRECTION_RIGHT:
        return this.keys[KeyHandler.KEY_RIGHT] || this.keys[KeyHandler.KEY_D];
      default:
        return false;
    }
  }

  bind(canvas: HTMLCanvasElement, document: Document) {
    document.addEventListener("keydown", this.handleKeyDown, false);
    document.addEventListener("keyup", this.handleKeyUp, false);
  }
}
