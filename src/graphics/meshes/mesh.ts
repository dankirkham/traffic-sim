import Matrix from "../util/matrix";
import Vector from "../util/vector";

export default class Mesh {
  protected offset: number;
  protected vertices: number[];
  protected colors: number[];

  readonly vectorSize: number = 4;

  constructor(arrayPosition: number) {
    // Divide by four because our mesh vertex arrays are 4-D vectors
    this.offset = Math.floor(arrayPosition / this.vectorSize);
  }

  public multiplyByMatrix(matrix: Matrix): Mesh {
    let multipliedVertices: number[] = [];

    for (let i: number = 0; i < Math.floor(this.vertices.length / this.vectorSize); i++) {
      let index: number = i * this.vectorSize;

      let vector: Vector = new Vector(
        this.vertices[index + 0],
        this.vertices[index + 1],
        this.vertices[index + 2],
        this.vertices[index + 3]
      );

      let multipliedVector = vector.multiplyByMatrix(matrix);

      multipliedVertices = multipliedVertices.concat(multipliedVector.flatten());
    }

    this.vertices = multipliedVertices;

    // To support chaining
    return this;
  }

  public render(gl : WebGLRenderingContext): void {
    console.error('Typescript is quirky. "export default abstract class" is not allowed. So this function can not be absract.');
  };

  public getVertices(): number[] {
    return this.vertices;
  }

  public getColors(): number[] {
    return this.colors;
  }
}
