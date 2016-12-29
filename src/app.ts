import Map from "./elements/map"
import Way from "./elements/way"
import GridMapGenerator from "./gen/gridMapGenerator";
import WebMapGenerator from "./gen/webMapGenerator";
import MapGeneratorConfig from "./gen/mapGeneratorConfig";
import CanvasGraphics from "./graphics/canvasGraphics";
import WebGLGraphics from "./graphics/webGLGraphics";
import Matrix from "./graphics/util/matrix";
// import Vector from "./graphics/util/vector";
import Camera from "./sim/camera";
import CameraConfig from "./sim/cameraConfig";

let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("mainCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let config: MapGeneratorConfig = new MapGeneratorConfig();

let map: Map = WebMapGenerator.generate(config);
// let map: Map = GridMapGenerator.generate(config);

let graphics: WebGLGraphics = new WebGLGraphics(canvas);

let cameraConfig: CameraConfig = new CameraConfig();
let camera: Camera = new Camera(cameraConfig);

camera.getOrigin().setX(map.getWidth() / 2);
camera.getOrigin().setY(map.getHeight() / 2);

// Mouse handling stuff
let mouseDown: boolean = false;
let lastMouseX: number = null;
let lastMouseY: number = null;

function handleMouseDown(event) {
  mouseDown = true;
  lastMouseX = event.clientX;
  lastMouseY = event.clientY;
}

function handleMouseUp(event) {
  mouseDown = false;
}

function handleMouseMove(event) {
  if (!mouseDown)
    return false;

  let mouseX: number = event.clientX;
  let mouseY: number = event.clientY;

  camera.setAzimuth(camera.getAzimuth() + cameraConfig.getHorizontalSensitivity() * (mouseX - lastMouseX));
  camera.setElevation(camera.getElevation() + cameraConfig.getVerticalSensitivity() * (mouseY - lastMouseY));

  lastMouseX = mouseX;
  lastMouseY = mouseY;

  graphics.draw(map, camera);
}

canvas.onmousedown = handleMouseDown;
document.onmouseup = handleMouseUp;
document.onmousemove = handleMouseMove;

// CanvasGraphics.draw(canvas, map, 1);
graphics.draw(map, camera);
