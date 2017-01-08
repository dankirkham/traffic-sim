import Mesh from "./mesh";
import Map from "../../elements/map";

export default class GrassMesh extends Mesh {
  constructor(offset: number, map: Map) {
    super(offset);

    this.vertices = [
      map.getWidth(), map.getHeight(), 0, 1,
      0, map.getHeight(), 0, 1,
      map.getWidth(), 0, 0, 1,
      0, 0, 0, 1,
    ];

    this.colors = [
      0, 0.8, 0, 1,
      0, 0.8, 0, 1,
      0, 0.8, 0, 1,
      0, 0.8, 0, 1,
    ];
  }

  public render(gl : WebGLRenderingContext): void {
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 0, 4);
  }
}
