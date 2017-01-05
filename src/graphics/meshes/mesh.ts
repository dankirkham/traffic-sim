export default class Mesh {
  protected offset: number;
  readonly vertices: number[];
  readonly colors: number[];

  constructor(arrayPosition: number) {
    // Divide by three because our mesh vertex arrays are 3-D vectors
    this.offset = Math.floor(arrayPosition / 3);
  }

  public render(gl : WebGLRenderingContext): void {
    console.error('Typescript is quirky. "export default abstract class" is not allowed. So this function can not be absract.');
  };
}
