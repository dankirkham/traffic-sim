import Building from "../elements/building";
import Intersection from "../elements/intersection";
import Map from "../elements/map";
import Point from "../elements/point";
import Way from "../elements/way";
import Matrix from "./util/matrix";
import Vector from "./util/vector";
import Camera from "../sim/camera";

export default class WebGLGraphics {
  private static FRAGMENT_SHADER_SOURCE: string =
  'varying lowp vec4 vColor; \
  void main(void) { \
    gl_FragColor = vColor; \
  }';

  private static VERTEX_SHADER_SOURCE: string =
  'attribute vec3 aVertexPosition; \
   attribute vec4 aVertexColor; \
   uniform mat4 uMVMatrix; \
   uniform mat4 uPMatrix; \
   varying lowp vec4 vColor; \
   void main(void) { \
     gl_Position = uMVMatrix * uPMatrix * vec4(aVertexPosition, 1.0); \
     vColor = aVertexColor; \
   }';

  private gl: WebGLRenderingContext;
  private shaderProgram;
  private uMVMatrix: Matrix;
  private uPMatrix: Matrix;
  private vertexPositionAttribute;
  private vertexColorAttribute;

  private initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl: WebGLRenderingContext = undefined;

    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl)
      console.error('Unable to initialize WebGL. You will not see anything.');

    return gl;
  }

  private buildShader(type, source: string) {
    let shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      let info: string = this.gl.getShaderInfoLog(shader);
      this.gl.deleteShader(shader);
      throw "Could not compile WebGL program.\n" + info;
    }

    return shader;
  }

  private initShaders() {
    let fragmentShader = this.buildShader(this.gl.FRAGMENT_SHADER, WebGLGraphics.FRAGMENT_SHADER_SOURCE);
    let vertexShader = this.buildShader(this.gl.VERTEX_SHADER, WebGLGraphics.VERTEX_SHADER_SOURCE);

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader(this.shaderProgram, fragmentShader);
    this.gl.attachShader(this.shaderProgram, vertexShader);
    this.gl.linkProgram(this.shaderProgram);

    if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
      console.error('Unable to use shader program: ' + this.gl.getProgramInfoLog(this.shaderProgram));
    }

    this.gl.useProgram(this.shaderProgram);

    this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

    this.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor');
    this.gl.enableVertexAttribArray(this.vertexColorAttribute);
  }

  private buildBuffer(map: Map, camera: Camera): WebGLBuffer {
    let pos: Vector = camera.getPosition();

    let vertices: number[] = [
      -0.5, 0.5, 0,
      -0.5, -0.5, 0,
      0.5, 0.5, 0,
      0.5, -0.5, 0,
      -0.25, 0.25, 0.5,
      -0.25, -0.25, 0.5,
      0.25, 0.25, 0.5,
      0.25, -0.25, 0.5,
      0.75, 1.25, 0.5,
      0.75, 0.75, 0.5,
      1.25, 1.25, 0.5,
      1.25, 0.75, 0.5,
      pos.getElement(0) - 0.05, pos.getElement(1) + 0.05, 0.0,
      pos.getElement(0) - 0.05, pos.getElement(1) - 0.05, 0.0,
      pos.getElement(0) + 0.05, pos.getElement(1) + 0.05, 0.0,
      pos.getElement(0) + 0.05, pos.getElement(1) - 0.05, 0.0,
      pos.getElement(0) - 0.05, pos.getElement(1) + 0.05, pos.getElement(2) / 3,
      pos.getElement(0) - 0.05, pos.getElement(1) - 0.05, pos.getElement(2) / 3,
      pos.getElement(0) + 0.05, pos.getElement(1) + 0.05, pos.getElement(2) / 3,
      pos.getElement(0) + 0.05, pos.getElement(1) - 0.05, pos.getElement(2) / 3,
      pos.getElement(0) - 0.05, pos.getElement(1) + 0.05, pos.getElement(2) / 3 * 2,
      pos.getElement(0) - 0.05, pos.getElement(1) - 0.05, pos.getElement(2) / 3 * 2,
      pos.getElement(0) + 0.05, pos.getElement(1) + 0.05, pos.getElement(2) / 3 * 2,
      pos.getElement(0) + 0.05, pos.getElement(1) - 0.05, pos.getElement(2) / 3 * 2,

    ];

    // let vertices: number[] = [
    //   0, map.getHeight(), 0,
    //   0, 0, 0,
    //   map.getWidth(), map.getHeight(), 0,
    //   map.getWidth(), 0, 0,
    // ];

    let vertexBuffer: WebGLBuffer = this.gl.createBuffer();

    let colors: number[] = [
      0.4, 1.0, 0.2, 1.0,
      0.4, 1.0, 0.2, 1.0,
      0.4, 1.0, 0.2, 1.0,
      0.4, 1.0, 0.2, 1.0,
      0.8, 0.0, 0.0, 1.0,
      0.8, 0.0, 0.0, 1.0,
      0.8, 0.0, 0.0, 1.0,
      0.8, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.8, 1.0,
      0.0, 0.0, 0.8, 1.0,
      0.0, 0.0, 0.8, 1.0,
      0.0, 0.0, 0.8, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.0, 0.0, 0.0, 1.0,
      0.5, 0.5, 0.0, 1.0,
      0.5, 0.5, 0.0, 1.0,
      0.5, 0.5, 0.0, 1.0,
      0.5, 0.5, 0.0, 1.0,
      0.0, 0.5, 0.5, 1.0,
      0.0, 0.5, 0.5, 1.0,
      0.0, 0.5, 0.5, 1.0,
      0.0, 0.5, 0.5, 1.0,
    ];

    // let colors: number[] = [
    //   1.0, 1.0, 1.0, 1.0,
    //   1.0, 1.0, 1.0, 1.0,
    //   1.0, 1.0, 1.0, 1.0,
    //   1.0, 1.0, 1.0, 1.0,
    // ];

    let colorBuffer: WebGLBuffer = this.gl.createBuffer();

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    this.gl.vertexAttribPointer(this.vertexColorAttribute, 4, this.gl.FLOAT, false, 0, 0);

    return vertexBuffer;
  }

  private buildMVMatrix(camera: Camera): Matrix {
    // let origin: Vector = new Vector(camera.getOrigin().getX(), camera.getOrigin().getY(), 0, 1);
    let origin: Vector = new Vector(0, 0, 0, 1);

    // let up: Vector = new Vector(0, 0, 1, 1);
    let up: Vector = camera.getUp();

    let matrix: Matrix = Matrix.makeLookAt(camera.getPosition(), origin, up);
    // let matrix: Matrix = Matrix.makeLookAt(origin, camera.getPosition(), up);

    return matrix.inverse();
  }

  private buildPMatrix(): Matrix {
    // return Matrix.perspective(45.0, 16/9, 0.01, 50);
    return Matrix.identity();
  }

  private setUniforms(): void {
    let mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.uMVMatrix.flatten()));

    let pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.uPMatrix.flatten()));
  }

  draw(map: Map, camera: Camera) {
    this.uMVMatrix = this.buildMVMatrix(camera);

    let b: Vector = new Vector(0.5, 0.5, 0.5, 1);

    console.log('b -> ' + b.multiplyByMatrix(this.uMVMatrix).multiplyByMatrix(this.uPMatrix).format());

    this.setUniforms();

    // Set clear color to sky blue, fully opaque
    this.gl.clearColor(0.4, 0.8, 1.0, 1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    // Near things obscure far things
    this.gl.depthFunc(this.gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.buildBuffer(map, camera);

    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 4, 4);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 8, 4);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 12, 4);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 16, 4);
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 20, 4);
  }

  constructor(canvas: HTMLCanvasElement) {
    this.gl = this.initWebGL(canvas);

    if (!this.gl)
      return;

    this.initShaders();

    this.uPMatrix = this.buildPMatrix();
  }
}
