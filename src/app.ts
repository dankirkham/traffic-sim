import World from "./elements/world";
import WorldGenerator from "./gen/worldGenerator";
import CanvasGraphics from "./graphics/canvasGraphics";
import WebGLGraphics from "./graphics/webGLGraphics";

let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("mainCanvas");

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 20;

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
