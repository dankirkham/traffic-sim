import Intersection from "../elements/intersection";

export default class IntersectionDistance extends Intersection {
  distance: number;

  static compareDistance(a: IntersectionDistance, b: IntersectionDistance): number {
    if (a.distance > b.distance) {
      return 1;
    } else if (a.distance < b.distance) {
      return -1
    } else {
      return 0;
    }
  }
}
