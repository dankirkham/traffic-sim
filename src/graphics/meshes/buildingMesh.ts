import {BuildingType} from "../../elements/buildingType";
import Mesh from "./mesh";

export default class BuildingMesh extends Mesh {
  constructor(offset: number, buildingType: BuildingType) {
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

    if (buildingType == BuildingType.Residential) {
      this.colors = [
        0.5, 0.2, 0.2, 1,
        0.5, 0.2, 0.2, 1,
        0.5, 0.2, 0.2, 1,
        0.5, 0.2, 0.2, 1,

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
    } else {
      this.colors = [
        0.2, 0.2, 0.5, 1,
        0.2, 0.2, 0.5, 1,
        0.2, 0.2, 0.5, 1,
        0.2, 0.2, 0.5, 1,

        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,

        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,

        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,

        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
        0, 0, 0.5, 1,
      ];
    }
  }

  public render(gl : WebGLRenderingContext): void {
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 0, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 4, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 8, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 12, 4);
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 16, 4);
  }
}
