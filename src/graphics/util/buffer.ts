import Mesh from '../meshes/mesh';
import World from '../../elements/world';

abstract class Buffer {
  protected vertices: number[];
  protected colors: number[];
  protected meshes: Mesh[];

  abstract build(world: World): void;

  constructor() {
    this.vertices = [];
    this.colors = [];
    this.meshes = [];
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

  protected pushMesh(mesh: Mesh) {
    this.vertices = this.vertices.concat(mesh.getVertices());
    this.colors = this.colors.concat(mesh.getColors());

    this.meshes.push(mesh);
  }

  public getVertices(): number[] {
    return this.vertices;
  }

  public getColors(): number[] {
    return this.colors;
  }

  public getMeshes(): Mesh[] {
    return this.meshes;
  }
}

export default Buffer;
