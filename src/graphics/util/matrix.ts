import Vector from "./vector"

export default class Matrix {
  private size: number = 4;
  private elements: number[][];

  static serialize(flattenedMatrix: number[]): Matrix {
    let matrix: Matrix = new Matrix();

    for (let i: number = 0; i < 4; i++) {
      for (let j: number = 0; j < 4; j++) {
        matrix.setElement(i, j, flattenedMatrix[j * 4 + i]);
      }
    }

    return matrix;
  }

  static makeLookAt(eye: Vector, center: Vector, up: Vector): Matrix {
    let z: Vector = eye.subtract(center).toUnit();
    let x: Vector = up.crossProduct(z).toUnit();
    let y: Vector = z.crossProduct(x).toUnit();

    console.log('eye = ' + eye.format());
    console.log('center = ' + center.format());
    console.log('up = ' + up.format());

    console.log('x = ' + x.format());
    console.log('y = ' + y.format());
    console.log('z = ' + z.format());

    let rotation: Matrix = new Matrix();

    rotation.setElement(0, 0, x.getElement(0));
    rotation.setElement(0, 1, x.getElement(1));
    rotation.setElement(0, 2, x.getElement(2));
    rotation.setElement(0, 3, -x.dotProduct(eye));

    rotation.setElement(1, 0, y.getElement(0));
    rotation.setElement(1, 1, y.getElement(1));
    rotation.setElement(1, 2, y.getElement(2));
    rotation.setElement(1, 3, -y.dotProduct(eye));

    rotation.setElement(2, 0, z.getElement(0));
    rotation.setElement(2, 1, z.getElement(1));
    rotation.setElement(2, 2, z.getElement(2));
    rotation.setElement(2, 3, -z.dotProduct(eye));

    rotation.setElement(3, 3, 1);

    // let translation: Matrix = Matrix.identity();
    //
    // translation.setElement(3, 0, -eye.getElement(0));
    // translation.setElement(3, 1, -eye.getElement(1));
    // translation.setElement(3, 2, -eye.getElement(2));
    //
    // return rotation.multiplyByMatrix(translation);

    return rotation;
  }

  static perspective(fovy: number, aspect: number, znear: number, zfar: number): Matrix {
    let ymax: number = znear * Math.tan(fovy * Math.PI / 360.0); // TODO: Why 360 and not 180?
    let ymin: number = -ymax;
    let xmin: number = ymin * aspect;
    let xmax: number = ymax * aspect;

    return Matrix.frustum(xmin, xmax, ymin, ymax, znear, zfar);
  }

  static frustum(left: number, right: number, bottom: number, top: number, znear: number, zfar: number): Matrix {
    let x: number = 2 * znear / (right - left);
    let y: number = 2 * znear / (top - bottom);
    let a: number = (right + left) / (right - left);
    let b: number = (top + bottom) / (top - bottom);
    let c: number = -(zfar + znear) / (zfar - znear);
    let d: number = -2 * zfar * znear / (zfar - znear);

    let matrix: Matrix = new Matrix();

    matrix.setElement(0, 0, x);
    matrix.setElement(1, 1, y);
    matrix.setElement(2, 2, c);
    matrix.setElement(2, 3, -1);
    matrix.setElement(3, 2, d);
    matrix.setElement(2, 0, a);
    matrix.setElement(2, 1, b);

    return matrix;
  }

  static rotation(axis: string, angle: number) {
    let rotationMatrix: Matrix = Matrix.identity();

    if (axis == 'x') {
      rotationMatrix.setElement(1, 1, Math.cos(angle * Math.PI / 180));
      rotationMatrix.setElement(2, 2, Math.cos(angle * Math.PI / 180));
      rotationMatrix.setElement(1, 2, -Math.sin(angle * Math.PI / 180));
      rotationMatrix.setElement(2, 1, Math.sin(angle * Math.PI / 180));
    } else if (axis == 'y') {
      rotationMatrix.setElement(0, 0, Math.cos(angle * Math.PI / 180));
      rotationMatrix.setElement(2, 2, Math.cos(angle * Math.PI / 180));
      rotationMatrix.setElement(0, 2, -Math.sin(angle * Math.PI / 180));
      rotationMatrix.setElement(2, 0, Math.sin(angle * Math.PI / 180));
    } else {
      rotationMatrix.setElement(0, 0, Math.cos(angle * Math.PI / 180));
      rotationMatrix.setElement(1, 1, Math.cos(angle * Math.PI / 180));
      rotationMatrix.setElement(0, 1, Math.sin(angle * Math.PI / 180));
      rotationMatrix.setElement(1, 0, -Math.sin(angle * Math.PI / 180));
    }

    return rotationMatrix;
  }

  static translation(position: Vector): Matrix {
    let matrix: Matrix = Matrix.identity();

    matrix.setElement(3, 0, position.getElement(0));
    matrix.setElement(3, 1, position.getElement(1));
    matrix.setElement(3, 2, position.getElement(2));

    return matrix;
  }

  static identity(size = 4): Matrix {
    let matrix: Matrix = new Matrix(size);

    for (let i: number = 0; i < size; i++) {
      matrix.setElement(i, i, 1);
    }

    return matrix;
  }

  constructor(size = 4) {
    this.elements = [];
    this.size = size;

    for (let i = 1; i <= this.size; i++) {
      let row: number[] = [];
      for (let j = 1; j <= this.size; j++) {
        row.push(0);
      }

      this.elements.push(row);
    }
  }

  inverse(): Matrix {
    // http://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix

    let m: number[] = this.flatten();
    let inv: number[] = [];
    let det: number;

    inv[0] = m[5]  * m[10] * m[15] -
             m[5]  * m[11] * m[14] -
             m[9]  * m[6]  * m[15] +
             m[9]  * m[7]  * m[14] +
             m[13] * m[6]  * m[11] -
             m[13] * m[7]  * m[10];

    inv[4] = -m[4]  * m[10] * m[15] +
              m[4]  * m[11] * m[14] +
              m[8]  * m[6]  * m[15] -
              m[8]  * m[7]  * m[14] -
              m[12] * m[6]  * m[11] +
              m[12] * m[7]  * m[10];

    inv[8] = m[4]  * m[9] * m[15] -
             m[4]  * m[11] * m[13] -
             m[8]  * m[5] * m[15] +
             m[8]  * m[7] * m[13] +
             m[12] * m[5] * m[11] -
             m[12] * m[7] * m[9];

    inv[12] = -m[4]  * m[9] * m[14] +
               m[4]  * m[10] * m[13] +
               m[8]  * m[5] * m[14] -
               m[8]  * m[6] * m[13] -
               m[12] * m[5] * m[10] +
               m[12] * m[6] * m[9];

    inv[1] = -m[1]  * m[10] * m[15] +
              m[1]  * m[11] * m[14] +
              m[9]  * m[2] * m[15] -
              m[9]  * m[3] * m[14] -
              m[13] * m[2] * m[11] +
              m[13] * m[3] * m[10];

    inv[5] = m[0]  * m[10] * m[15] -
             m[0]  * m[11] * m[14] -
             m[8]  * m[2] * m[15] +
             m[8]  * m[3] * m[14] +
             m[12] * m[2] * m[11] -
             m[12] * m[3] * m[10];

    inv[9] = -m[0]  * m[9] * m[15] +
              m[0]  * m[11] * m[13] +
              m[8]  * m[1] * m[15] -
              m[8]  * m[3] * m[13] -
              m[12] * m[1] * m[11] +
              m[12] * m[3] * m[9];

    inv[13] = m[0]  * m[9] * m[14] -
              m[0]  * m[10] * m[13] -
              m[8]  * m[1] * m[14] +
              m[8]  * m[2] * m[13] +
              m[12] * m[1] * m[10] -
              m[12] * m[2] * m[9];

    inv[2] = m[1]  * m[6] * m[15] -
             m[1]  * m[7] * m[14] -
             m[5]  * m[2] * m[15] +
             m[5]  * m[3] * m[14] +
             m[13] * m[2] * m[7] -
             m[13] * m[3] * m[6];

    inv[6] = -m[0]  * m[6] * m[15] +
              m[0]  * m[7] * m[14] +
              m[4]  * m[2] * m[15] -
              m[4]  * m[3] * m[14] -
              m[12] * m[2] * m[7] +
              m[12] * m[3] * m[6];

    inv[10] = m[0]  * m[5] * m[15] -
              m[0]  * m[7] * m[13] -
              m[4]  * m[1] * m[15] +
              m[4]  * m[3] * m[13] +
              m[12] * m[1] * m[7] -
              m[12] * m[3] * m[5];

    inv[14] = -m[0]  * m[5] * m[14] +
               m[0]  * m[6] * m[13] +
               m[4]  * m[1] * m[14] -
               m[4]  * m[2] * m[13] -
               m[12] * m[1] * m[6] +
               m[12] * m[2] * m[5];

    inv[3] = -m[1] * m[6] * m[11] +
              m[1] * m[7] * m[10] +
              m[5] * m[2] * m[11] -
              m[5] * m[3] * m[10] -
              m[9] * m[2] * m[7] +
              m[9] * m[3] * m[6];

    inv[7] = m[0] * m[6] * m[11] -
             m[0] * m[7] * m[10] -
             m[4] * m[2] * m[11] +
             m[4] * m[3] * m[10] +
             m[8] * m[2] * m[7] -
             m[8] * m[3] * m[6];

    inv[11] = -m[0] * m[5] * m[11] +
               m[0] * m[7] * m[9] +
               m[4] * m[1] * m[11] -
               m[4] * m[3] * m[9] -
               m[8] * m[1] * m[7] +
               m[8] * m[3] * m[5];

    inv[15] = m[0] * m[5] * m[10] -
              m[0] * m[6] * m[9] -
              m[4] * m[1] * m[10] +
              m[4] * m[2] * m[9] +
              m[8] * m[1] * m[6] -
              m[8] * m[2] * m[5];

    det = m[0] * inv[0] + m[1] * inv[4] + m[2] * inv[8] + m[3] * inv[12];

    if (det == 0)
        return null;

    det = 1.0 / det;

    let inverse: Matrix = Matrix.serialize(inv);

    return inverse.multiplyByScalar(det);
  }

  multiplyByMatrix(that: Matrix) {
    let product: Matrix = new Matrix();

    for (let row: number = 0; row < this.size; row++) {
      for (let col: number = 0; col < this.size; col++) {
        let val: number = 0;

        for (let i: number = 0; i < this.size; i++ ) {
          val += this.getElement(row, i) * that.getElement(i, col);
        }

        product.setElement(row, col, val);
      }
    }

    return product;
  }

  multiplyByScalar(scalar: number) {
    let product: Matrix = new Matrix(this.size);

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        product.setElement(i, j, this.getElement(i, j) * scalar);
      }
    }

    return product;
  }

  add(that: Matrix) {
    let sum: Matrix = new Matrix(this.size);

    for (let i = 1; i <= this.size; i++) {
      for (let j = 1; j <= this.size; j++) {
        sum.setElement(i, j, this.getElement(i, j) + that.getElement(i, j));
      }
    }

    return sum;
  }

  subtract(that: Matrix) {
    let difference: Matrix = new Matrix(this.size);

    for (let i = 1; i <= this.size; i++) {
      for (let j = 1; j <= this.size; j++) {
        difference.setElement(i, j, this.getElement(i, j) - that.getElement(i, j));
      }
    }

    return difference;
  }

  getElement(row: number, col: number): number {
    if (row > (this.size - 1) || row < 0)
      return null;
    if (col > (this.size - 1) || col < 0)
      return null;

    return this.elements[row][col];
  }

  setElement(row: number, col: number, val: number) {
    if (row > (this.size - 1) || row < 0)
      return;
    if (col > (this.size - 1) || col < 0)
      return;

    this.elements[row][col] = val;
  }

  getSubblock(row: number, col: number): Matrix {
    if (this.size != 4)
      return;

    if (row < 0 || row >= 2)
      return;

    if (col < 0 || col >= 2)
      return;

    let subblock: Matrix = new Matrix(2);

    for (let i: number = 0; i < 2; i++) {
      for (let j: number = 0; j < 2; j++) {
        subblock.setElement(i, j, this.getElement(2 * row + i, 2 * col + j));
      }
    }

    return subblock;
  }

  setSubblock(row: number, col: number, subblock: Matrix) {
    if (this.size != 4)
      return;

    // if (subblock.getSize() != 2) // TODO
    //   return

    if (row < 0 || row >= 2)
      return;

    if (col < 0 || col >= 2)
      return;

    for (let i: number = 0; i < 2; i++) {
      for (let j: number = 0; j < 2; j++) {
        this.setElement(2 * row + i, 2 * col + j, subblock.getElement(i, j));
      }
    }
  }

  flatten(): number[] {
    let array: number[] = [];

    for (let row: number = 0; row < this.size; row++) {
      for (let col: number = 0; col < this.size; col++) {
        array.push(this.getElement(row, col));
      }
    }

    return array;
  }

  format(): string {
    let str: string = "[ ";

    for (let row: number = 0; row < this.size; row++) {
      for (let col: number = 0; col < this.size; col++) {
        str += this.getElement(row, col);

        if (col < this.size - 1) {
          str += ", ";
        }
      }

      str += "; ";
    }

    str += "]";

    return str;
  }
}
