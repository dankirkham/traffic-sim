import Building from "../elements/building";
import Intersection from "../elements/intersection";
import Map from "../elements/map";
import Point from "../elements/point";
import Way from "../elements/way";
import World from "../elements/world";
import Graphics from "./graphics";
import Car from '../elements/car';

export default class CanvasGraphics implements Graphics {
  private scale: number;
  private canvas: HTMLCanvasElement;

  private drawWays(context: CanvasRenderingContext2D, ways: Way[], scale: number) {
    context.beginPath();

    for (let way of ways) {
      let point0: Point = way.getIntersection(0).getLocation();
      let point1: Point = way.getIntersection(1).getLocation();

      context.moveTo(point0.getX() * scale, point0.getY() * scale);
      context.lineTo(point1.getX() * scale, point1.getY() * scale);
      context.stroke();
    }

    context.closePath();
  }

  private drawIntersections(context: CanvasRenderingContext2D, intersections: Intersection[], scale: number) {
    let id = context.createImageData(1, 1);
    let d = id.data;
    d[0] = 255;
    d[3] = 255;

    for (let intersection of intersections) {
      let location: Point = intersection.getLocation();

      let x: number = location.getX();
      let y: number = location.getY();

      context.putImageData(id, x * scale, y * scale);

      context.putImageData(id, x * scale + 1, y * scale);
      context.putImageData(id, x * scale - 1, y * scale);

      context.putImageData(id, x * scale, y * scale + 1);
      context.putImageData(id, x * scale, y * scale - 1);
    }
  }

private drawBuildings(context: CanvasRenderingContext2D, buildings: Building[], scale: number) {
    let BOX_SIZE: number = 20;

    let id = context.createImageData(1, 1);
    let d = id.data;
    d[0] = 255;
    d[1] = 255;
    d[3] = 255;

    for (let building of buildings) {
      let location: Point = building.getLocation();

      context.save();

      context.beginPath();

      context.translate(location.getX() * scale, location.getY() * scale,);

      context.rotate(-building.getWay().getHeading() * Math.PI / 180);

      context.fillRect(-BOX_SIZE / 2 * scale,
                       -BOX_SIZE / 2 * scale,
                       BOX_SIZE * scale,
                       BOX_SIZE * scale);

      context.restore();

      // Draw address
      let addressLocation: Point = building.getWay().getLocationOfAddress(building.getDistance());

      let x: number = addressLocation.getX();
      let y: number = addressLocation.getY();

      context.putImageData(id, x * scale, y * scale);

      context.putImageData(id, x * scale + 1, y * scale);
      context.putImageData(id, x * scale - 1, y * scale);

      context.putImageData(id, x * scale, y * scale + 1);
      context.putImageData(id, x * scale, y * scale - 1);
    }
  }

  private drawCars(context: CanvasRenderingContext2D, cars: Car[], scale: number) {
    let id = context.createImageData(1, 1);
    let d = id.data;
    d[0] = 255;
    d[2] = 255;
    d[3] = 255;

    for (let car of cars) {
      let carLocation: Point = car.getWay().getLocationOfAddress(car.getWayPosition());

      let x: number = carLocation.getX();
      let y: number = carLocation.getY();

      context.putImageData(id, x * scale, y * scale);

      context.putImageData(id, x * scale + 1, y * scale);
      context.putImageData(id, x * scale - 1, y * scale);

      context.putImageData(id, x * scale, y * scale + 1);
      context.putImageData(id, x * scale, y * scale - 1);
    }
  }

  draw(world: World) {
    let context: CanvasRenderingContext2D = this.canvas.getContext("2d");

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let map: Map = world.getMap();

    this.drawWays(context, map.getWays(), this.scale);

    this.drawIntersections(context, map.getIntersections(), this.scale);

    this.drawBuildings(context, map.getBuildings(), this.scale)

    this.drawCars(context, world.getCars(), this.scale);
  }

  constructor(canvas: HTMLCanvasElement, scale: number) {
    this.canvas = canvas;
    this.scale = scale;
  }
}
