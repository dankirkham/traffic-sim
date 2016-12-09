import * as grid from "./gen/grid";
import * as graphics from "./graphics";

var canvas = <HTMLCanvasElement> document.getElementById("mainCanvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var map = grid.buildGrid(855, 1520);

graphics.draw(context, map, 1);
