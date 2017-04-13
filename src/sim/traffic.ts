
import World from '../elements/world';
import Car from '../elements/car';

export default class Traffic {
  private world: World;

  constructor(world: World) {
    this.world = world;
  }

  tick(): void {
    let cars: Car[] = this.world.getCars();

    for (var i = cars.length - 1; i >= 0; i--) {
      if (cars[i].getArrived()) {
        // Delete car if it has arrived at its destination.
        cars.splice(i, 1);

        continue;
      }

      cars[i].move();
    }
  }
}
