
import Buffer from './buffer';
import World from '../../elements/world';
import Map from '../../elements/map';
import AxisMesh from '../meshes/axisMesh';
import GrassMesh from '../meshes/grassMesh';
import BuildingMesh from '../meshes/buildingMesh';
import Point from '../../elements/point';
import Vector from './vector';
import RoadMesh from '../meshes/roadMesh';
import Matrix from './matrix';

export default class StaticBuffer extends Buffer {
  public build(world: World): void {
    let map: Map = world.getMap();

    // Axis coordinates
    let axis: AxisMesh = new AxisMesh(this.vertices.length);
    this.pushMesh(axis);

    // GrassMesh
    let grassMesh: GrassMesh = new GrassMesh(this.vertices.length, map);
    this.pushMesh(grassMesh);

    // BuildingMesh
    for (let building of map.getBuildings()) {
      let mesh: BuildingMesh = new BuildingMesh(this.vertices.length, building.getType());

      mesh.multiplyByMatrix(Matrix.scale(20));

      mesh.multiplyByMatrix(Matrix.rotation('z', -building.getWay().getHeading()));

      let location: Point = building.getLocation();
      mesh.multiplyByMatrix(Matrix.translation(new Vector(location.getX(), location.getY(), 0, 1)));

      this.pushMesh(mesh);
    }

    for (let way of map.getWays()) {
      let roadMesh: RoadMesh = new RoadMesh(this.vertices.length, way);
      this.pushMesh(roadMesh);
    }
  }
}
