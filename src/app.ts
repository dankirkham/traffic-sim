import Map from "./elements/map"
import Way from "./elements/way"
import GridMapGenerator from "./gen/gridMapGenerator";
import WebMapGenerator from "./gen/webMapGenerator";
import MapGeneratorConfig from "./gen/mapGeneratorConfig";
import CanvasGraphics from "./graphics/canvasGraphics";
import WebGLGraphics from "./graphics/webGLGraphics";

let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("mainCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let config: MapGeneratorConfig = new MapGeneratorConfig();

let map: Map = WebMapGenerator.generate(config);
// let map: Map = GridMapGenerator.generate(config);

CanvasGraphics.draw(canvas, map, 1);
// WebGLGraphics.draw(canvas, map, 1);
