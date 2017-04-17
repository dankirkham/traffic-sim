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

      mesh.multiplyByMatrix(Matrix.scale(10));

      mesh.multiplyByMatrix(Matrix.rotation('z', -car.getWay().getHeading()));

      let location: Point = car.getWay().getLocationOfAddress(car.getWayPosition());
      mesh.multiplyByMatrix(Matrix.translation(new Vector(location.getX(), location.getY(), 0, 1)));

      this.pushMesh(mesh);
    }
  }
}
