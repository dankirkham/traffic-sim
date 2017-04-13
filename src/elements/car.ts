import Intersection from './intersection';
import Person from './person';
import Building from './building';
import Way from './way';

export default class Car {
  public static TARGET_DISTANCE = 0.1;
  public static DISTANCE_PER_TICK = 0.02;

  private person: Person;
  private path: Intersection[];
  private pathIndex: number;

  private way: Way;
  private wayPosition: number;
  private wayDirectionPositive: boolean;

  private destination: Building;

  private arrived: boolean;

  private checkArrivedAtDestination(): boolean {
    if (this.destination.getWay() == this.way &&
        this.destination.getDistance() >= this.wayPosition - Car.TARGET_DISTANCE &&
        this.destination.getDistance() <= this.wayPosition + Car.TARGET_DISTANCE) {
          return true;
        }

    return false;
  }

  private checkArrivedAtIntersection(): boolean {
    if (this.wayDirectionPositive) {
      return this.wayPosition >= 1.0 - Car.TARGET_DISTANCE;
    } else {
      return this.wayPosition <= Car.TARGET_DISTANCE;
    }
  }

  private advanceCar() {
    if (this.wayDirectionPositive) {
      this.wayPosition += Car.DISTANCE_PER_TICK;

      if (this.wayPosition > 1) {
        this.wayPosition = 1;
      }
    } else {
      this.wayPosition -= Car.DISTANCE_PER_TICK;

      if (this.wayPosition < 0) {
        this.wayPosition = 0;
      }
    }
  }

  private moveToNextWay() {
    // Move to next way with correct heading, distance, and direction.

    if (this.pathIndex + 1 >= this.path.length) {
      // Path index out of range
      console.error('Car has reached end of path without arriving at destination. Something has gone horribly wrong.');
      return;
    }

    this.way = this.path[this.pathIndex].getWayBetween(this.path[this.pathIndex + 1]);
    this.wayDirectionPositive = this.way.getDirectionToIntersection(this.path[this.pathIndex + 1]);
    this.wayPosition = this.wayDirectionPositive ? 0 : 1;

    this.pathIndex += 1; // Point to next intersection
  }

  constructor(person: Person, path: Intersection[], destination: Building, startingWay: Way) {
    this.person = person;
    this.path = path;
    this.destination = destination;

    this.way = startingWay;
    this.wayPosition = this.destination.getDistance();
    this.wayDirectionPositive = this.way.getDirectionToIntersection(this.path.length >= 1 ? this.path[0] : null);

    this.pathIndex = 0;

    this.arrived = false;
  }

  move() {
    if (this.arrived)
      return true;

    if (this.checkArrivedAtDestination()) {
      this.arrived = true;
      return;
    }

    if (this.checkArrivedAtIntersection()) {
      this.moveToNextWay();
    } else {
      this.advanceCar();
    }
  }

  getArrived(): boolean {
    return this.arrived;
  }
}
