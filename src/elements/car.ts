import Intersection from './intersection';
import Person from './person';
import Building from './building';
import Way from './way';
import { CarColor } from './carColor';
import { CarState } from './carState';

export default class Car {
  public static TARGET_DISTANCE = 0.01;
  public static MIN_FOLLOW_DISTANCE = 5;
  public static MAX_ACCELERATION = 10;
  public static MAX_SPEED = 1;

  private person: Person;
  private path: Intersection[];
  private pathIndex: number;

  private way: Way;
  private wayPosition: number;
  private wayDirectionPositive: boolean;

  private destination: Building;

  private state: CarState;

  // Physics properties
  private speed: number = 0;

  // Removes car from old way before moving to new way
  // TODO: Change to best practice getter
  private changeWay(way: Way) {
    if (this.way) {
      this.way.removeCar(this);
    }
    this.way = way;
    this.way.addCar(this);
  }

  // Get car in front of this car on the way
  private getCarInFront(): Car {
    let cars: Car[] = this.way.getCars();

    let closestCar: Car = null;

    for (let car of cars) {
      // Not the same car, but going the same direction
      if (car != this && car.getWayDirectionPositive() == this.getWayDirectionPositive()) {
        if (this.getWayDirectionPositive()) {
          if (car.getWayPosition() > this.getWayPosition()) {
            if (!closestCar || closestCar.getWayPosition() > car.getWayPosition()) {
              closestCar = car;
            }
          }
        } else {
          if (car.getWayPosition() < this.getWayPosition()) {
            if (!closestCar || closestCar.getWayPosition() < car.getWayPosition()) {
              closestCar = car;
            }
          }
        }
      }
    }

    return closestCar;
  }

  private checkArrivedAtDestination(): boolean {
    // if (this.destination.getWay() === this.way) {
    //   console.log('A car is on the same way as it\'s destination.')
    // }

    if (this.destination.getWay() === this.way) {
      if (this.wayDirectionPositive)
        return this.wayPosition >= this.destination.getDistance() - Car.TARGET_DISTANCE
      else
        return this.wayPosition <= this.destination.getDistance() + Car.TARGET_DISTANCE;
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
    let targetSpeed: number;
    let frontDistance: number;

    // Get car in front of this one
    let carInFront: Car = this.getCarInFront();

    if (carInFront) {
      // Maintain safe following distance
      targetSpeed = carInFront.getSpeed();
      frontDistance = Math.abs(carInFront.getWayPosition() - this.getWayPosition()) * this.way.getLength() - Car.MIN_FOLLOW_DISTANCE;

      // if (frontDistance < 0) {
      //   console.log('wtf');
      //   // frontDistance = 0;
      // }
    } else {
      // Slowly arrive at the intersection
      targetSpeed = Car.MAX_SPEED;

      if (this.getWayDirectionPositive()) {
        frontDistance = (1 - this.getWayPosition()) * this.way.getLength();
      } else {
        frontDistance = this.getWayPosition() * this.way.getLength();
      }
    }

    if (frontDistance < Car.MIN_FOLLOW_DISTANCE) {
      if (frontDistance != 0) {
        targetSpeed = targetSpeed * (frontDistance / Car.MIN_FOLLOW_DISTANCE);
      } else {
        targetSpeed = 0;
      }
    }

    let acceleration: number = (targetSpeed - this.getSpeed()) / 10;

    // Bound acceleration
    if (acceleration > Car.MAX_ACCELERATION) {
      acceleration = Car.MAX_ACCELERATION;
    } else if (acceleration < -Car.MAX_ACCELERATION) {
      console.log('acceleration upper bound');
      acceleration = -Car.MAX_ACCELERATION;
    }

    // Accumulate speed
    this.speed += acceleration;

    // Bound speed
    if (this.speed > Car.MAX_SPEED) {
      this.speed = Car.MAX_SPEED;
    }

    if (this.speed == 0) {
      console.log('Car with speed 0; frontDistance = ' + frontDistance + '; targetSpeed = ' + targetSpeed + '; acceleration = ' + acceleration);
    }

    // Scale car displacement based on length of way.
    let displacement: number = this.getSpeed() / this.way.getLength();

    // Move the car, bounding it on [0, 1]
    if (this.wayDirectionPositive) {
      this.wayPosition += displacement;
    } else {
      this.wayPosition -= displacement;
    }

    // Bound position
    if (this.wayPosition > 1) {
      this.wayPosition = 1;
    } else if (this.wayPosition < 0) {
      this.wayPosition = 0;
    }
  }

  private moveToNextWay() {
    // Move to next way with correct heading, distance, and direction.

    if (this.pathIndex + 1 >= this.path.length) {
      // Make way to the destination
      if (!this.destination.getWay().isConnectedToIntersection(this.path[this.pathIndex])) {
        console.error('A car has a bad path and cannot reach it\'s destination.');
      } else {
        this.changeWay(this.destination.getWay());

        // ! (not) is here because we are going *away* from the last intersection in the path.
        this.wayDirectionPositive = !this.way.getDirectionToIntersection(this.path[this.pathIndex]);
        this.wayPosition = this.wayDirectionPositive ? 0 : 1;
      }
    } else {
      // Make way to the next intersection.
      this.changeWay(this.path[this.pathIndex].getWayBetween(this.path[this.pathIndex + 1]));

      this.wayDirectionPositive = this.way.getDirectionToIntersection(this.path[this.pathIndex + 1]);
      this.wayPosition = this.wayDirectionPositive ? 0 : 1;

      this.pathIndex += 1; // Point to next intersection
    }
  }

  constructor(person: Person, path: Intersection[], destination: Building, startingWay: Way) {
    this.person = person;
    this.path = path;
    this.destination = destination;

    this.changeWay(startingWay);

    this.wayPosition = this.destination.getDistance();
    this.wayDirectionPositive = this.way.getDirectionToIntersection(this.path.length >= 1 ? this.path[0] : null);

    this.pathIndex = 0;

    this.state = CarState.Traveling;

    if (this.way === this.destination.getWay()) {
      console.log('A car has started on the same way as it\'s destination.');
    }
  }

  advanceThroughIntersection(): void {
    this.state = CarState.Traveling;
    
    this.moveToNextWay();
  }

  move() {
    if (this.state == CarState.Arrived)
      return true;

    if (this.checkArrivedAtDestination()) {
      // Remove from way
      this.way.removeCar(this);

      this.state = CarState.Arrived;
      // console.log('A car has arrived at its destination.');
      return;
    }

    if (this.checkArrivedAtIntersection()) {
     if (this.state != CarState.Queued) {
       // Queue at correct intersection
       let intersection: Intersection = this.way.getIntersection(this.getWayDirectionPositive() ? 1 : 0);

       intersection.addCarToQueue(this);

       this.state = CarState.Queued;
     }
    } else {
      this.advanceCar();
    }
  }

  getState(): CarState {
    return this.state;
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

  getSpeed(): number {
    return this.speed;
  }
}
