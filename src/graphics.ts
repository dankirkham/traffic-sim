import Building from "./elements/building";
import Point from "./elements/point";

export function draw(context, map, scale) {
  context.beginPath();

  var ways = map.getWays();

  for (var i = 0; i < ways.length; i++) {
    var point0 = ways[i].getIntersection(0).getLocation();
    var point1 = ways[i].getIntersection(1).getLocation();

    context.moveTo(point0.getX() * scale, point0.getY() * scale);
    context.lineTo(point1.getX() * scale, point1.getY() * scale);
    context.stroke();
  }

  let BOX_SIZE: number = 20;

  for (let building of map.getBuildings()) {
    let location: Point = building.getLocation();

    context.fillRect((location.getX() - BOX_SIZE / 2) * scale,
                     (location.getY() - BOX_SIZE / 2) * scale,
                     BOX_SIZE * scale,
                     BOX_SIZE * scale);
  }
}
