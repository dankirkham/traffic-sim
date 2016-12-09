import Intersection from "./intersection";
import Point from "./point";

export default class Way {
  intersections: Intersection[];

  constructor(intersection0: Intersection, intersection1: Intersection) {
    this.intersections = new Array();

    this.intersections[0] = intersection0;
    this.intersections[1] = intersection1;
  }

  getIntersection(intersection: number): Intersection {
    return this.intersections[intersection];
  }

  private sqr(x: number): number {
    return x * x;
  }

  private dist2(v: Point, w: Point): number {
    return this.sqr(v.getX() - w.getX()) + this.sqr(v.getY() - w.getY());
  }

  private distToSegmentSquared(p: Point): number {
    let v: Point = this.getIntersection(0).getLocation();
    let w: Point = this.getIntersection(1).getLocation();

    var l2: number = this.dist2(v, w);

    if (l2 == 0)
      return this.dist2(p, v);

    var t: number = ((p.getX() - v.getX()) * (w.getX() - v.getX()) + (p.getY() - v.getY()) * (w.getY() - v.getY())) / l2;

    t = Math.max(0, Math.min(1, t));

    let pointOnWay: Point = new Point(v.getX() + t * (w.getX() - v.getX()), v.getY() + t * (w.getY() - v.getY()));

    return this.dist2(p, pointOnWay);
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

  getDistance(p: Point): number {
    // For Diagnostics
    // let x0: number = p.getX();
    // let y0: number = p.getY();
    //
    // let x1: number = this.getIntersection(0).getLocation().getX();
    // let y1: number = this.getIntersection(0).getLocation().getY();
    //
    // let x2: number = this.getIntersection(1).getLocation().getX();
    // let y2: number = this.getIntersection(1).getLocation().getY();

    let distance: number = Math.sqrt(this.distToSegmentSquared(p));

    //console.log('(' + x0 + ', ' + y0 + ') -> (' + x1 + ', ' + y1 + ')-(' + x2 + ', ' + y2 + ') = ' + distance);

    return distance;
  }

  // Bad algorithm. This is distance to a line, not a line segment.
  // getDistance(point: Point): number {
  //   // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Line_defined_by_two_points
  //
  //   let x0: number = point.getX();
  //   let y0: number = point.getY();
  //
  //   let x1: number = this.getIntersection(0).getLocation().getX();
  //   let y1: number = this.getIntersection(0).getLocation().getY();
  //
  //   let x2: number = this.getIntersection(1).getLocation().getX();
  //   let y2: number = this.getIntersection(1).getLocation().getY();
  //
  //   let numerator: number = Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1);
  //   let denominator: number = Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
  //
  //   let distance: number = numerator / denominator;
  //
  //   // Check to see if
  //
  //   console.log('(' + x0 + ', ' + y0 + ') -> (' + x1 + ', ' + y1 + ')-(' + x2 + ', ' + y2 + ') = ' + distance);
  //
  //   return distance;
  // }

  isIntersecting (that: Way): boolean {
    // http://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect/1968345#1968345

    let p0: Point = this.getIntersection(0).getLocation();
    let p1: Point = this.getIntersection(1).getLocation();
    let p2: Point = that.getIntersection(0).getLocation();
    let p3: Point = that.getIntersection(1).getLocation();

    let s1: Point = new Point(p1.getX() - p0.getX(),
                              p1.getY() - p0.getY());
    let s2: Point = new Point(p3.getX() - p2.getX(),
                              p3.getY() - p2.getY());

    let s: number;
    let t: number;
    s = (-s1.getY() * (p0.getX() - p2.getX()) + s1.getX() * (p0.getY() - p2.getY())) / (-s2.getX() * s1.getY() + s1.getX() * s2.getY());
    t = ( s2.getX() * (p0.getY() - p2.getY()) - s2.getY() * (p0.getX() - p2.getX())) / (-s2.getX() * s1.getY() + s1.getX() * s2.getY());

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected

        // Intersection Point
        // if (i_x != NULL)
        //     *i_x = p0.getX() + (t * s1.getX());
        // if (i_y != NULL)
        //     *i_y = p0.getY() + (t * s1.getY());

        return true;
    }

    return false; // No collision
  }
}
