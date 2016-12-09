import GridMapGenerator from "./gen/gridMapGenerator";
import WebMapGenerator from "./gen/webMapGenerator";
import * as graphics from "./graphics";
import MapGeneratorConfig from "./gen/mapGeneratorConfig"

var canvas = <HTMLCanvasElement> document.getElementById("mainCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");

var config = new MapGeneratorConfig();

//var map = WebMapGenerator.generate(config);
var map = GridMapGenerator.generate(config);

graphics.draw(context, map, 1);
