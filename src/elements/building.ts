import Point from "../elements/point"
import Way from "../elements/way";

export default class Building {
  protected location: Point;
  protected way: Way;

  // Distance between way intersection0 and intersection1.
  // This is the closest point on the way to the building.
  // This works as the physical address of the building
  // 0 = at intersection0
  // 1 = at intersection1
  // 0.5 = halway between two intersections
  distance: number;

  constructor(location: Point, way: Way, distance: number) {
    this.location = location;
    this.distance = distance;

    this.setWay(way);
  }

  getLocation(): Point {
    return this.location;
  }

  setWay(way: Way) {
    this.way = way;

    if (way)
      way.addBuilding(this);
  }
}
