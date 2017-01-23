import Map from "./elements/map";
import Person from "./elements/person";
import Way from "./elements/way";
import World from "./elements/world"
import GridMapGenerator from "./gen/gridMapGenerator";
import WebMapGenerator from "./gen/webMapGenerator";
import MapGeneratorConfig from "./gen/mapGeneratorConfig";
import CanvasGraphics from "./graphics/canvasGraphics";
import WebGLGraphics from "./graphics/webGLGraphics";
import Matrix from "./graphics/util/matrix";
import Camera from "./sim/camera";
import CameraConfig from "./sim/cameraConfig";
import KeyHandler from "./sim/keyHandler";
import MouseHandler from "./sim/mouseHandler";
import Scheduler from "./sim/scheduler/scheduler";
import SchedulerEventType from "./sim/scheduler/schedulerEventType";

let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("mainCanvas");

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let config: MapGeneratorConfig = new MapGeneratorConfig();

let map: Map = WebMapGenerator.generate(config);
// let map: Map = GridMapGenerator.generate(config);

let keyHandler: KeyHandler = new KeyHandler();
keyHandler.bind(canvas, document);

let cameraConfig: CameraConfig = new CameraConfig();
let camera: Camera = new Camera(cameraConfig, keyHandler);

let world: World = new World();
world.setMap(map);
world.setCamera(camera);

let graphics: WebGLGraphics = new WebGLGraphics(canvas, map);
// let graphics: CanvasGraphics = new CanvasGraphics(canvas, 1);

camera.getLocation().setX(map.getWidth() / 2);
camera.getLocation().setY(map.getHeight() / 2);

let mouseHandler: MouseHandler = new MouseHandler(camera);
mouseHandler.bind(canvas, document);

// Initialize Schedule?!?!?!?!?! TODO:
let scheduler: Scheduler = new Scheduler();
world.setScheduler(scheduler);

for (let person of map.getPersons()) {
  scheduler.schedule(person, SchedulerEventType.HomeToWork);
}

function graphicsTick() {
  graphics.draw(world);
}

setInterval(graphicsTick, 15);

function cameraTick() {
  camera.tick(10);
}

setInterval(cameraTick, 10);
