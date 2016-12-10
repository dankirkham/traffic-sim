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
    if (index == 0 || index == 1) {
      if (this.intersections[index] != intersection) {
        this.intersections[index] = intersection;

        if (intersection)
          intersection.addWay(this);
      }
    }
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

    return this.dist2(v, pointOnWay) / this.dist2(v, w);
  }

  isIntersecting (that: Way): boolean {
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

  getBuildings(): Building[] {
    return this.buildings;
  }

  addBuilding(building: Building) {
    if (building && this.buildings.indexOf(building) > -1) {
      this.buildings.push(building);

      // TODO: Sort buildings by distance.

      building.setWay(this);
    }
  }

  isConnectedToIntersection(intersection: Intersection) {
    return intersection == this.getIntersection(0) || intersection == this.getIntersection(1);
  }

  isConnectedToWay(that: Way) {
    return this.getIntersection(0) == that.getIntersection(0) ||
           this.getIntersection(0) == that.getIntersection(1) ||
           this.getIntersection(1) == that.getIntersection(0) ||
           this.getIntersection(1) == that.getIntersection(1);
  }
}
