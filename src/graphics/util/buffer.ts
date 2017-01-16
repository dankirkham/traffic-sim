import Building from "../../elements/building";
import Point from "../../elements/point";
import Map from "../../elements/map";
import Way from "../../elements/way"
import Mesh from "../meshes/mesh";
import AxisMesh from "../meshes/axisMesh";
import BuildingMesh from "../meshes/buildingMesh";
import GrassMesh from "../meshes/grassMesh";
import RoadMesh from "../meshes/roadMesh";
import Matrix from "./matrix";
import Vector from "./vector";

export default class Buffer {
  private vertices: number[];
  private colors: number[];
  private meshes: Mesh[];

  constructor() {
    this.vertices = [];
    this.colors = [];
    this.meshes = [];
  }

  public build(map: Map): void {
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

  public bind(gl: WebGLRenderingContext, aVertexPosition, aVertexColor): void {
    let vertexBuffer: WebGLBuffer = gl.createBuffer();
    let colorBuffer: WebGLBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aVertexPosition, 4, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aVertexColor, 4, gl.FLOAT, false, 0, 0);
  }

  public render(gl: WebGLRenderingContext): void {
    for (let mesh of this.meshes) {
      mesh.render(gl);
    }
  }

  private pushMesh(mesh: Mesh) {
    this.vertices = this.vertices.concat(mesh.getVertices());
    this.colors = this.colors.concat(mesh.getColors());

    this.meshes.push(mesh);
  }

  public getVertices() {
    return this.vertices;
  }

  public getColors() {
    return this.colors;
  }

  public getMeshes() {
    return this.meshes;
  }
}
