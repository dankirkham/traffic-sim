import Map from "./elements/map";
import Person from "./elements/person";
import Way from "./elements/way";
import World from "./elements/world";
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

let world: World = WorldGenerator.generate(canvas);

let graphics: WebGLGraphics = new WebGLGraphics(canvas, world.getMap());
// let graphics: CanvasGraphics = new CanvasGraphics(canvas, 1);

function graphicsTick() {
  graphics.draw(world);
}

setInterval(graphicsTick, 15);

function cameraTick() {
  world.getCamera().tick(10);
}

setInterval(cameraTick, 10);
