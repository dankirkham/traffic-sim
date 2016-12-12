import Map from "./elements/map"
import Way from "./elements/way"
import GridMapGenerator from "./gen/gridMapGenerator";
import WebMapGenerator from "./gen/webMapGenerator";
import * as graphics from "./graphics";
import MapGeneratorConfig from "./gen/mapGeneratorConfig"

let canvas: HTMLCanvasElement = <HTMLCanvasElement> document.getElementById("mainCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let context: CanvasRenderingContext2D = canvas.getContext("2d");

let config: MapGeneratorConfig = new MapGeneratorConfig();

let map: Map = WebMapGenerator.generate(config);
// let map: Map = GridMapGenerator.generate(config);

graphics.draw(context, map, 1);
