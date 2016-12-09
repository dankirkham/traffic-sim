import Point from "../elements/point";

export default class Intersection {
  location: Point;

  constructor(location: Point) {
    this.location = location;
  }

  getLocation(): Point {
    return this.location;
  }
}
