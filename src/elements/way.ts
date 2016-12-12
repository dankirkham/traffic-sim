import Building from "./building";
import Intersection from "./intersection";
import Point from "./point";

export default class Way {
  protected intersections: Intersection[];
  protected buildings: Building[];

  constructor(intersection0: Intersection, intersection1: Intersection) {
    this.intersections = new Array();
    this.buildings = [];

    this.setIntersection(0, intersection0);
    this.setIntersection(1, intersection1);
  }

  setIntersection(index: number, intersection: Intersection) {
    if (index == 0 || index == 1)
      this.intersections[index] = intersection;
  }

  getIntersection(index: number): Intersection {
    if (index == 0 || index == 1) {
      return this.intersections[index];
    } else {
      return undefined;
    }
  }

  private sqr(x: number): number {
    return x * x;
  }

  private dist2(v: Point, w: Point): number {
    return this.sqr(v.getX() - w.getX()) + this.sqr(v.getY() - w.getY());
  }

  getDistance(p: Point): number {
    let v: Point = this.getIntersection(0).getLocation();
    let w: Point = this.getIntersection(1).getLocation();

    var l2: number = this.dist2(v, w);

    if (l2 == 0)
      return this.dist2(p, v);

    var t: number = ((p.getX() - v.getX()) * (w.getX() - v.getX()) + (p.getY() - v.getY()) * (w.getY() - v.getY())) / l2;

    t = Math.max(0, Math.min(1, t));

    let pointOnWay: Point = new Point(v.getX() + t * (w.getX() - v.getX()), v.getY() + t * (w.getY() - v.getY()));

    return Math.sqrt(this.dist2(p, pointOnWay));
  }

  getAddress(p: Point): number {
    let v: Point = this.getIntersection(0).getLocation();
    let w: Point = this.getIntersection(1).getLocation();

    var l2: number = this.dist2(v, w);

    if (l2 == 0)
      return 0;

    var t: number = ((p.getX() - v.getX()) * (w.getX() - v.getX()) + (p.getY() - v.getY()) * (w.getY() - v.getY())) / l2;

    t = Math.max(0, Math.min(1, t));

    let pointOnWay: Point = new Point(v.getX() + t * (w.getX() - v.getX()), v.getY() + t * (w.getY() - v.getY()));

    return v.getDistance(pointOnWay) / v.getDistance(w);
  }

  getLocationOfAddress(address: number): Point {
    let v: Point = this.getIntersection(0).getLocation();
    let w: Point = this.getIntersection(1).getLocation();

    return w.subtract(v).scalarMultiply(address).add(v);
  }

  getCommonIntersection(that: Way): Intersection {
    if (this.getIntersection(0) == that.getIntersection(0) || this.getIntersection(0) == that.getIntersection(1)) {
      return this.getIntersection(0);
    } else if (this.getIntersection(1) == that.getIntersection(0) || this.getIntersection(1) == that.getIntersection(1)) {
      return this.getIntersection(1);
    } else {
      console.error('Way.getCommonIntersection() error: unconnected');
      return undefined;
    }
  }

  getOtherIntersection(intersection: Intersection) {
    if (this.getIntersection(0) == intersection) {
      return this.getIntersection(1);
    } else if (this.getIntersection(1) == intersection) {
      return this.getIntersection(0);
    } else {
      console.error('Way.getOtherIntersection() error: unconnected');
      return undefined;
    }
  }

  getHeading(): number {
    let vector = this.getIntersection(1).getLocation().subtract(this.getIntersection(0).getLocation());

    return Math.atan(vector.getX() / vector.getY()) * (180 / Math.PI);
  }

  getAngleBetweenWay(that: Way): number {
    let commonIntersection: Intersection = this.getCommonIntersection(that);

    let thisDestination: Point = this.getOtherIntersection(commonIntersection).getLocation();
    let thatDestination: Point = that.getOtherIntersection(commonIntersection).getLocation();
    let source: Point = commonIntersection.getLocation();

    let thisVector: Point = source.subtract(thisDestination);
    let thatVector: Point = source.subtract(thatDestination);

    return Math.acos(thisVector.dotProduct(thatVector) / thisVector.magnitude() / thatVector.magnitude()) * (180 / Math.PI);
  }

  getMinAngleBetweenWays(ways: Way[]): number {
    let minimum: number = 180.0;

    for (let way of ways) {
      let angle: number = this.getAngleBetweenWay(way);

      if (minimum > angle) {
        minimum = angle;
      }
    }

    return minimum;
  }

  isIntersectingWay(that: Way): boolean {
    // http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345
    let p0: Point = this.getIntersection(0).getLocation();
    let p1: Point = this.getIntersection(1).getLocation();
    let p2: Point = that.getIntersection(0).getLocation();
    let p3: Point = that.getIntersection(1).getLocation();

    let s1: Point = new Point(p1.getX() - p0.getX(), p1.getY() - p0.getY());
    let s2: Point = new Point(p3.getX() - p2.getX(), p3.getY() - p2.getY());

    let s: number = (-s1.getY() * (p0.getX() - p2.getX()) + s1.getX() * (p0.getY() - p2.getY())) / (-s2.getX() * s1.getY() + s1.getX() * s2.getY());
    let t: number = ( s2.getX() * (p0.getY() - p2.getY()) - s2.getY() * (p0.getX() - p2.getX())) / (-s2.getX() * s1.getY() + s1.getX() * s2.getY());

    return s >= 0 && s <= 1 && t >= 0 && t <= 1;
  }

  isIntersectingWays (ways: Way[]): boolean {
    for (let that of ways) {
      if (this.isIntersectingWay(that)) {
        // If the ways share endpoints, they are technically intersecting,
        // but we make an exception here and say that they aren't.
        if (!this.isConnectedToWay(that)) {
          return true;
        }
      }
    }

    return false;
  }

  getBuildings(): Building[] {
    return this.buildings;
  }

  addBuilding(building: Building) {
    if (building && this.buildings.indexOf(building) == -1) {
      this.buildings.push(building);

      // TODO: Sort buildings by distance.
    }
  }

  isConnectedToIntersection(intersection: Intersection) {
    return (this.getIntersection(0) && intersection == this.getIntersection(0)) ||
           (this.getIntersection(1) && intersection == this.getIntersection(1));
  }

  isConnectedToWay(that: Way) {
    return this.getIntersection(0) == that.getIntersection(0) ||
           this.getIntersection(0) == that.getIntersection(1) ||
           this.getIntersection(1) == that.getIntersection(0) ||
           this.getIntersection(1) == that.getIntersection(1);
  }

  link() {
    for (let building of this.buildings) {
      building.setWay(this);
    }

    this.getIntersection(0).addWay(this);
    this.getIntersection(1).addWay(this);
  }
}
