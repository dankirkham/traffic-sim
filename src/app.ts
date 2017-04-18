import World from "./elements/world";
import WorldGenerator from "./gen/worldGenerator";
import CanvasGraphics from "./graphics/canvasGraphics";
import WebGLGraphics from "./graphics/webGLGraphics";
import Clock from "./sim/clock";
import Scheduler from './sim/scheduler/scheduler';
import Traffic from './sim/traffic';

let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("mainCanvas");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

let world: World = WorldGenerator.generate(canvas);

let graphics: WebGLGraphics = new WebGLGraphics(canvas, world);
// let graphics: CanvasGraphics = new CanvasGraphics(canvas, 1.0);

function graphicsTick() {
  graphics.draw(world);
}

setInterval(graphicsTick, 15);

function cameraTick() {
  world.getCamera().tick(10);
}

setInterval(cameraTick, 10);

// Clock
let clock: Clock = new Clock();

function clockTick() {
  clock.tick();
}

setInterval(clockTick, 417);

// TODO: All the clock stuff might need to go into the world generator...
world.setClock(clock);

// Scheduler
let scheduler: Scheduler = world.getScheduler();

function schedulerTick() {
  scheduler.tick(clock.getTime(), world);
}

setInterval(schedulerTick, 417);

// Traffic
let traffic: Traffic = new Traffic(world);

function trafficTick() {
  traffic.tick();
}

setInterval(trafficTick, 30);
