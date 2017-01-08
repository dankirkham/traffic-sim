import Mesh from "./mesh";
import Intersection from "../../elements/intersection";
import Point from "../../elements/point";
import Way from "../../elements/way";

export default class RoadMesh extends Mesh {
  constructor(offset: number, way: Way) {
    super(offset);

    let intersection0: Point = way.getIntersection(0).getLocation();
    let intersection1: Point = way.getIntersection(1).getLocation();

    let roadHalfWidth: number = 2;
    let heading: number = way.getHeading() * Math.PI / 180;

    let pointA: Point = new Point(intersection0.getX() + roadHalfWidth * Math.cos(heading),
                                  intersection0.getY() - roadHalfWidth * Math.sin(heading));

    let pointB: Point = new Point(intersection0.getX() - roadHalfWidth * Math.cos(heading),
                                  intersection0.getY() + roadHalfWidth * Math.sin(heading));

    let pointC: Point = new Point(intersection1.getX() - roadHalfWidth * Math.cos(heading),
                                  intersection1.getY() + roadHalfWidth * Math.sin(heading));

    let pointD: Point = new Point(intersection1.getX() + roadHalfWidth * Math.cos(heading),
                                  intersection1.getY() - roadHalfWidth * Math.sin(heading));

    this.vertices = [
      pointC.getX(), pointC.getY(), 1, 1,
      pointB.getX(), pointB.getY(), 1, 1,
      pointD.getX(), pointD.getY(), 1, 1,
      pointA.getX(), pointA.getY(), 1, 1,
    ];

    this.colors = [
      0.313, 0.349, 0.407, 1,
      0.313, 0.349, 0.407, 1,
      0.313, 0.349, 0.407, 1,
      0.313, 0.349, 0.407, 1
    ];
  }

  public render(gl : WebGLRenderingContext): void {
    gl.drawArrays(gl.TRIANGLE_STRIP, this.offset + 0, 4);
  }
}
