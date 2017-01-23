import Camera from "./Camera";
import CameraConfig from "./CameraConfig";

export default class MouseHandler {
  private mouseDown: boolean;
  private lastMouseX: number;
  private lastMouseY: number;
  private camera: Camera;

  constructor(camera: Camera) {
    this.camera = camera;

    this.mouseDown = false;
    this.lastMouseX = null;
    this.lastMouseY = null
  }

  // This works and I don't really care to learn why right now.
  // http://stackoverflow.com/questions/20627138/typescript-this-scoping-issue-when-called-in-jquery-callback

  private handleMouseDown = (event) => {
    this.mouseDown = true;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  private handleMouseUp = (event) => {
    this.mouseDown = false;
  }

  private handleMouseMove = (event) => {
    if (!this.mouseDown)
      return false;

    let mouseX: number = event.clientX;
    let mouseY: number = event.clientY;

    this.camera.setAzimuth(this.camera.getAzimuth() + this.camera.getConfig().getHorizontalSensitivity() * (mouseX - this.lastMouseX));
    this.camera.setElevation(this.camera.getElevation() + this.camera.getConfig().getVerticalSensitivity() * (mouseY - this.lastMouseY));

    this.lastMouseX = mouseX;
    this.lastMouseY = mouseY;
  }

  private handleMouseWheel = (event) => {
    let delta: number = -event.wheelDelta;

    this.camera.setRange(this.camera.getRange() + this.camera.getConfig().getZoomSensitivity() * delta);
  }

  bind(canvas: HTMLCanvasElement) {
    canvas.onmousedown = this.handleMouseDown;
    document.onmouseup = this.handleMouseUp;
    document.onmousemove = this.handleMouseMove;

    canvas.addEventListener("mousewheel", this.handleMouseWheel, false);
    canvas.addEventListener("DOMMouseScroll", this.handleMouseWheel, false);
  }
}
