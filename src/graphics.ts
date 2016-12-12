import Building from "./elements/building";
import Intersection from "./elements/intersection";
import Map from "./elements/map";
import Point from "./elements/point";
import Way from "./elements/way";

function drawWays(context: CanvasRenderingContext2D, ways: Way[], scale: number) {
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

function drawIntersections(context: CanvasRenderingContext2D, intersections: Intersection[], scale: number) {
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

function drawBuildings(context: CanvasRenderingContext2D, buildings: Building[], scale: number) {
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

export function draw(context: CanvasRenderingContext2D, map: Map, scale: number) {
  drawWays(context, map.getWays(), scale);

  drawIntersections(context, map.getIntersections(), scale);

  drawBuildings(context, map.getBuildings(), scale)
}
