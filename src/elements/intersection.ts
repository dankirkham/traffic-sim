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
    if (way && this.ways.indexOf(way) == -1) {
      this.ways.push(way);

      // TODO: Sort ways by heading.
    }
  }

  getWays(): Way[] {
    return this.ways;
  }

  isConnectedToIntersection(intersection: Intersection) {
    for (var way of this.ways) {
      if (way.isConnectedToIntersection(intersection)) {
        return true;
      }
    }

    return false;
  }

  getWayBetween(that: Intersection): Way {
    for (let way of this.ways) {
      if (way.isConnectedToIntersection(this) && way.isConnectedToIntersection(that)) {
        return way;
      }
    }

    return null;
  }
}
