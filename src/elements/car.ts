import Intersection from './intersection';
import Person from './person';
import Building from './building';
import Way from './way';
import { CarColor } from './carColor';

export default class Car {
  public static TARGET_DISTANCE = 0.03;
  public static SPEED = 1;

  private person: Person;
  private path: Intersection[];
  private pathIndex: number;

  private way: Way;
  private wayPosition: number;
  private wayDirectionPositive: boolean;

  private destination: Building;

  private arrived: boolean;

  private checkArrivedAtDestination(): boolean {
    // if (this.destination.getWay() === this.way) {
    //   console.log('A car is on the same way as it\'s destination.')
    // }

    // TODO: This gets tightened up. Check using wayDirectionPositive so that
    // the TARGET_DISTANCE window cannot be skipped.
    if (this.destination.getWay() === this.way &&
        this.wayPosition >= this.destination.getDistance() - Car.TARGET_DISTANCE &&
        this.wayPosition <= this.destination.getDistance() + Car.TARGET_DISTANCE) {
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
    // Scale car displacement based on length of way.
    let displacement: number = Car.SPEED / this.way.getLength();

    // Move the car, bounding it on [0, 1]
    if (this.wayDirectionPositive) {
      this.wayPosition += displacement;

      if (this.wayPosition > 1) {
        this.wayPosition = 1;
      }
    } else {
      this.wayPosition -= displacement;

      if (this.wayPosition < 0) {
        this.wayPosition = 0;
      }
    }
  }

  private moveToNextWay() {
    // Move to next way with correct heading, distance, and direction.

    if (this.pathIndex + 1 >= this.path.length) {
      // Make way to the destination
      if (!this.destination.getWay().isConnectedToIntersection(this.path[this.pathIndex])) {
        console.error('A car has a bad path and cannot reach it\'s destination.');
      } else {
        this.way = this.destination.getWay();
        // ! (not) is here because we are going *away* from the last intersection in the path.
        this.wayDirectionPositive = !this.way.getDirectionToIntersection(this.path[this.pathIndex]);
        this.wayPosition = this.wayDirectionPositive ? 0 : 1;
      }
    } else {
      // Make way to the next intersection.
      this.way = this.path[this.pathIndex].getWayBetween(this.path[this.pathIndex + 1]);
      this.wayDirectionPositive = this.way.getDirectionToIntersection(this.path[this.pathIndex + 1]);
      this.wayPosition = this.wayDirectionPositive ? 0 : 1;

      this.pathIndex += 1; // Point to next intersection
    }
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

    if (this.way === this.destination.getWay()) {
      console.log('A car has started on the same way as it\'s destination.');
    }
  }

  move() {
    if (this.arrived)
      return true;

    if (this.checkArrivedAtDestination()) {
      this.arrived = true;
      // console.log('A car has arrived at its destination.');
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

  getWay(): Way {
    return this.way;
  }

  getWayPosition(): number {
    return this.wayPosition;
  }

  getWayDirectionPositive(): boolean {
    return this.wayDirectionPositive;
  }

  getPerson(): Person {
    return this.person;
  }
}
