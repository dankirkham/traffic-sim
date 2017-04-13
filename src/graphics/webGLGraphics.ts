import Building from "../elements/building";
import Intersection from "../elements/intersection";
import Map from "../elements/map";
import Point from "../elements/point";
import Way from "../elements/way";
import World from "../elements/world";
import Matrix from "./util/matrix";
import Vector from "./util/vector";
import Buffer from "./util/buffer";
import Camera from "../sim/camera";
import Graphics from "./graphics";

export default class WebGLGraphics implements Graphics {
  private static FRAGMENT_SHADER_SOURCE: string =
  'varying lowp vec4 vColor; \
  void main(void) { \
    gl_FragColor = vColor; \
  }';

  private static VERTEX_SHADER_SOURCE: string =
  'attribute vec4 aVertexPosition; \
   attribute vec4 aVertexColor; \
   uniform mat4 uMVMatrix; \
   uniform mat4 uPMatrix; \
   varying lowp vec4 vColor; \
   void main(void) { \
     gl_Position = uPMatrix * uMVMatrix * aVertexPosition; \
     vColor = aVertexColor; \
   }';

  private gl: WebGLRenderingContext;
  private canvas: HTMLCanvasElement;
  private shaderProgram;
  private uMVMatrix: Matrix;
  private uPMatrix: Matrix;
  private aVertexPosition;
  private aVertexColor;
  private staticBuffer: Buffer;

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

    this.aVertexPosition = this.gl.getAttribLocation(this.shaderProgram, 'aVertexPosition');
    this.gl.enableVertexAttribArray(this.aVertexPosition);

    this.aVertexColor = this.gl.getAttribLocation(this.shaderProgram, 'aVertexColor');
    this.gl.enableVertexAttribArray(this.aVertexColor);
  }

  private buildMVMatrix(camera: Camera): Matrix {
    let cameraMatrix: Matrix = Matrix.translation(new Vector(-camera.getLocation().getX(), -camera.getLocation().getY(), 0, 1));

    let standUpMatrix: Matrix = Matrix.rotation('x', 90);

    let azimuthMatrix: Matrix = Matrix.rotation('y', camera.getAzimuth());

    let elevationMatrix: Matrix = Matrix.rotation('x', -camera.getElevation());

    let rangeMatrix: Matrix = Matrix.translation(new Vector(0, 0, -camera.getRange(), 1));

    return cameraMatrix.multiplyByMatrix(standUpMatrix).multiplyByMatrix(azimuthMatrix).multiplyByMatrix(elevationMatrix).multiplyByMatrix(rangeMatrix);
  }

  private buildPMatrix(): Matrix {
    return Matrix.perspective(60, this.canvas.width / this.canvas.height, 10, 1500);
  }

  private setUniforms(): void {
    let mvUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVMatrix");
    this.gl.uniformMatrix4fv(mvUniform, false, new Float32Array(this.uMVMatrix.flatten()));

    let pUniform = this.gl.getUniformLocation(this.shaderProgram, "uPMatrix");
    this.gl.uniformMatrix4fv(pUniform, false, new Float32Array(this.uPMatrix.flatten()));
  }

  draw(world: World) {
    let camera: Camera = world.getCamera();

    this.uMVMatrix = this.buildMVMatrix(camera);

    this.setUniforms();

    // Set clear color to sky blue, fully opaque
    this.gl.clearColor(0.4, 0.8, 1.0, 1.0);
    // Enable depth testing
    this.gl.enable(this.gl.DEPTH_TEST);
    // Near things obscure far things
    this.gl.depthFunc(this.gl.LEQUAL);

    this.gl.enable(this.gl.CULL_FACE);

    // Clear the color as well as the depth buffer.
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.staticBuffer.bind(this.gl, this.aVertexPosition, this.aVertexColor);
    this.staticBuffer.render(this.gl);
  }

  constructor(canvas: HTMLCanvasElement, map: Map) {
    this.canvas = canvas;

    this.gl = this.initWebGL(canvas);

    if (!this.gl)
      return;

    this.initShaders();

    this.uPMatrix = this.buildPMatrix();

    this.staticBuffer = new Buffer();
    this.staticBuffer.build(map);
  }
}
