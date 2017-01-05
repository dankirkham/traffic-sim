import Map from "../../elements/map";
import Camera from "../../sim/camera";

import Mesh from "../meshes/mesh";
import AxisMesh from "../meshes/axisMesh";

export default class Buffer {
  private vertices: number[];
  private colors: number[];
  private meshes: Mesh[];

  constructor() {
    this.vertices = [];
    this.colors = [];
    this.meshes = [];
  }

  public build(map: Map, camera: Camera): void {
    let axis: AxisMesh = new AxisMesh(this.vertices.length);

    this.pushMesh(axis);

    this.meshes.push(axis);
  }

  public bind(gl: WebGLRenderingContext, aVertexPosition, aVertexColor): void {
    let vertexBuffer: WebGLBuffer = gl.createBuffer();
    let colorBuffer: WebGLBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 0, 0);

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
    this.vertices = this.vertices.concat(mesh.vertices);
    this.colors = this.colors.concat(mesh.colors);
  }
}
