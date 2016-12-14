import Building from "../elements/building";
import Intersection from "../elements/intersection";
import Map from "../elements/map";
import Point from "../elements/point";
import Way from "../elements/way";

export default class CanvasGraphics {
  private static FRAGMENT_SHADER_SOURCE: string =
  'void main(void) { \
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0); \
  }';

  private static VERTEX_SHADER_SOURCE: string =
  'attribute vec3 aVertexPosition; \
   void main(void) { \
     gl_Position = vec4(aVertexPosition, 1.0); \
   }';

  private static initWebGL(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let gl: WebGLRenderingContext = undefined;

    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    if (!gl)
      console.error('Unable to initialize WebGL. You will not see anything.');

    return gl;
  }

  private static buildShader(gl: WebGLRenderingContext, type, source: string) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      let info: string = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw "Could not compile WebGL program.\n" + info;
    }

    return shader;
  }

  private static initShaders(gl: WebGLRenderingContext) {
    let fragmentShader = this.buildShader(gl, gl.FRAGMENT_SHADER, this.FRAGMENT_SHADER_SOURCE);
    let vertexShader = this.buildShader(gl, gl.VERTEX_SHADER, this.VERTEX_SHADER_SOURCE);

    let shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, fragmentShader);
    gl.attachShader(shaderProgram, vertexShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      console.error('Unable to use shader program: ' + gl.getProgramInfoLog(shaderProgram));
    }

    gl.useProgram(shaderProgram);

    let vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPositionAttribute);
  }

  static buildBuffer(gl: WebGLRenderingContext): WebGLBuffer {
    let vertices: number[] = [
      -0.5,  0.5, 0.0,
      -0.5, -0.5, 0.0,
       0.0,  0.5, 0.0,
       0.0, -0.5, 0.0,
     ];

    let vertexBuffer: WebGLBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    //gl.bindBuffer(gl.ARRAY_BUFFER, null);

    return vertexBuffer;
  }

  static draw(canvas: HTMLCanvasElement, map: Map, scale: number) {
    let gl: WebGLRenderingContext = this.initWebGL(canvas);

    if (!gl)
      return;

    this.buildBuffer(gl);
    this.initShaders(gl);

     // Set clear color to black, fully opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);
    // Near things obscure far things
    // gl.depthFunc(gl.LEQUAL);
    // Clear the color as well as the depth buffer.
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}
