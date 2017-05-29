import CarMesh from '../meshes/carMesh';
import World from '../../elements/world';
import Buffer from './buffer';
import Matrix from './matrix';
import Point from '../../elements/point';
import Vector from './vector';

export default class DynamicBuffer extends Buffer {
  public build(world: World): void {
    for (let car of world.getCars()) {
      let mesh: CarMesh = new CarMesh(this.vertices.length, car.getPerson().getCarColor());

      mesh.multiplyByMatrix(Matrix.scale(1.5));

      mesh.multiplyByMatrix(Matrix.rotation('z', -car.getWay().getHeading()));

      let location: Point = car.getWay().getLocationOfAddress(car.getWayPosition());

      // Determine right or left side of road
      let angleOffset: number = car.getWayDirectionPositive() ? 90 : -90;

      // Move to right side of road
      let offset: Point = new Point(
        Math.sin((car.getWay().getHeading() + angleOffset) * (Math.PI / 180)),
        Math.cos((car.getWay().getHeading() + angleOffset) * (Math.PI / 180))
      );

      location = location.add(offset);

      mesh.multiplyByMatrix(Matrix.translation(new Vector(location.getX(), location.getY(), 0, 1)));

      this.pushMesh(mesh);
    }
  }
}
