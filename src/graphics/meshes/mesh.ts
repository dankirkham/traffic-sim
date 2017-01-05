export default class Mesh {
  protected offset: number;
  readonly vertices: number[];
  readonly colors: number[];

  constructor(offset: number) {
    this.offset = offset;
  }

  public render(gl : WebGLRenderingContext): void {
    console.error('Typescript is quirky. "export default abstract class" is not allowed. So this function can not be absract.');
  };
}
