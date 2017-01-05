import Map from "../../elements/map";

import Mesh from "../meshes/mesh";
import AxisMesh from "../meshes/axisMesh";
import BuildingMesh from "../meshes/buildingMesh";
import Matrix from "./matrix";

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

    // BuildingMesh
    let building: BuildingMesh = new BuildingMesh(this.vertices.length);

    building.multiplyByMatrix(Matrix.rotation('z', 45));

    this.pushMesh(building);
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
