import Map from "./elements/map";
import Way from "./elements/way";
import World from "./elements/world"
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

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let config: MapGeneratorConfig = new MapGeneratorConfig();

let map: Map = WebMapGenerator.generate(config);
// let map: Map = GridMapGenerator.generate(config);

let cameraConfig: CameraConfig = new CameraConfig();
let camera: Camera = new Camera(cameraConfig);

let world: World = new World();
world.setMap(map);
world.setCamera(camera);

let graphics: WebGLGraphics = new WebGLGraphics(canvas, map);
// let graphics: CanvasGraphics = new CanvasGraphics(canvas, 1);

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

  // graphics.draw(world);
}

function handleMouseWheel(event) {
  let delta: number = -event.wheelDelta;

  camera.setRange(camera.getRange() + cameraConfig.getZoomSensitivity() * delta);

  // graphics.draw(world);
}

canvas.onmousedown = handleMouseDown;
document.onmouseup = handleMouseUp;
document.onmousemove = handleMouseMove;

canvas.addEventListener("mousewheel", handleMouseWheel, false);
canvas.addEventListener("DOMMouseScroll", handleMouseWheel, false);

// CanvasGraphics.draw(world);

function tick() {
  graphics.draw(world);
}

setInterval(tick, 15);

// graphics.draw(world);
