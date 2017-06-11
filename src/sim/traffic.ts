
import World from '../elements/world';
import Car from '../elements/car';
import { CarState } from '../elements/carState';
import Intersection from '../elements/intersection';

export default class Traffic {
  private world: World;

  constructor(world: World) {
    this.world = world;
  }

  tick(): void {
    // Move cars
    let cars: Car[] = this.world.getCars();

    for (var i = cars.length - 1; i >= 0; i--) {
      if (cars[i].getState() == CarState.Arrived) {
        // Delete car if it has arrived at its destination.
        cars.splice(i, 1);

        continue;
      }

      cars[i].move();
    }

    // Process stop sign queues
    let intersections: Intersection[] = this.world.getMap().getIntersections();

    for (let intersection of intersections) {
      intersection.tick();
    }
  }
}
