import Point from "../elements/point";
import Way from "../elements/way";

export default class Intersection {
  protected location: Point;
  protected ways: Way[];

  constructor(location: Point) {
    this.location = location;
    this.ways = []
  }

  getLocation(): Point {
    return this.location;
  }

  addWay(way: Way) {
    if (way && this.ways.indexOf(way) > -1) {
      this.ways.push(way);

      // TODO: Sort ways by heading.
    }
  }

  getWays(): Way[] {
    return this.ways;
  }
}
