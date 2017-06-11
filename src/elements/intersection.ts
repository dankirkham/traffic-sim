import Point from "../elements/point";
import Way from "../elements/way";
import Car from './car';

export default class Intersection {
  public static TICK_COUNTER = 15; // 500 ms

  protected location: Point;
  protected ways: Way[];

  private counter: number;
  private carQueue: Car[];

  constructor(location: Point) {
    this.location = location;
    this.ways = []

    this.counter = 0;

    this.carQueue = [];
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

  addCarToQueue(car: Car) {
    if (car) {
      this.carQueue.push(car);
    }
  }

  tick(): void {
    if (this.counter == 0) {
      if (this.carQueue.length > 0) {
        let car: Car = this.carQueue.shift();

        car.advanceThroughIntersection();
      }
    }

    this.counter = (this.counter + 1) % Intersection.TICK_COUNTER;
  }
}
