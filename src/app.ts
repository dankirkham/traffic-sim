import Map from "./elements/map";
import Person from "./elements/person";
import Way from "./elements/way";
import World from "./elements/world";
import GridMapGenerator from "./gen/map/gridMapGenerator";
import WebMapGenerator from "./gen/map/webMapGenerator";
import MapGeneratorConfig from "./gen/map/mapGeneratorConfig";
import WorldGenerator from "./gen/worldGenerator";
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

let world: World = WorldGenerator.generate(canvas, map);

let graphics: WebGLGraphics = new WebGLGraphics(canvas, map);
// let graphics: CanvasGraphics = new CanvasGraphics(canvas, 1);

function graphicsTick() {
  graphics.draw(world);
}

setInterval(graphicsTick, 15);

function cameraTick() {
  world.getCamera().tick(10);
}

setInterval(cameraTick, 10);
