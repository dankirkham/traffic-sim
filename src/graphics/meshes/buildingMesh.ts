import Mesh from "./mesh";

export default class BuildingMesh extends Mesh {
  constructor(offset: number) {
    super(offset);

    this.vertices = [
      // Roof
      0.5, 0.5, 1, 1,
      -0.5, 0.5, 1, 1,
      0.5, -0.5, 1, 1,
      -0.5, -0.5, 1, 1,

      // Front, +X
      0.5, 0.5, 0, 1,
      0.5, 0.5, 1, 1,
      0.5, -0.5, 0, 1,
      0.5, -0.5, 1, 1,

      // Back, -X
      -0.5, 0.5, 0, 1,
      -0.5, -0.5, 0, 1,
      -0.5, 0.5, 1, 1,
      -0.5, -0.5, 1, 1,

      // Left, +Y
      0.5, 0.5, 0, 1,
      -0.5, 0.5, 0, 1,
      0.5, 0.5, 1, 1,
      -0.5, 0.5, 1, 1,

      // Right, -Y
      -0.5, -0.5, 0, 1,
      0.5, -0.5, 0, 1,
      -0.5, -0.5, 1, 1,
      0.5, -0.5, 1, 1,
    ];

    this.colors = [
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,

      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,

      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,

      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,

      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
      0.5, 0, 0, 1,
    ];
  }

  public render(gl : WebGLRenderingContext): void {
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 0, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 4, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 12, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 16, 4);
  }
}
