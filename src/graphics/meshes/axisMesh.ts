import Mesh from "./mesh";

export default class AxisMesh extends Mesh {
  readonly vertices: number[] = [
    // X Vector, red
    1, 0.01, 0,
    0, 0.01, 0,
    1, -0.01, 0,
    0, -0.01, 0,

    // Y Vector, green
    0.01, 1, 0,
    -0.01, 1, 0,
    0.01, 0, 0,
    -0.01, 0, 0,

    // Z Vector 1, blue
    0.01, 0, 1,
    0.01, 0, 0,
    -0.01, 0, 1,
    -0.01, 0, 0,

    // Z Vector 2, blue
    0.01, 0, 1,
    -0.01, 0, 1,
    0.01, 0, 0,
    -0.01, 0, 0,
  ];

  readonly colors: number[] = [
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,
    1, 0, 0, 1,

    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,
    0, 1, 0, 1,

    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,

    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
    0, 0, 1, 1,
  ];

  constructor(offset: number) {
    super(offset);
  }

  public render(gl : WebGLRenderingContext): void {
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 0, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 4, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 12, 4);
  }
}
