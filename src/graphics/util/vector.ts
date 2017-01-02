import Matrix from "./matrix"

export default class Vector {
  private size: number = 4;
  private elements: number[];

  constructor(a: number, b: number, c: number, d: number) {
    this.elements = [a, b, c, d];
  }

  setElement(element: number, value: number) {
    if (element < 0 || element > this.size - 1)
      return;

    this.elements[element] = value;
  }

  getElement(element: number): number {
    if (element < 0 || element > this.size - 1)
      return null;

    return this.elements[element];
  }

  multiplyByScalar(scalar: number): Vector {
    let product: Vector = new Vector(0, 0, 0, 1);

    for (let x = 0; x < this.size - 1; x++) {
      product.setElement(x, this.getElement(x) * scalar);
    }

    return product;
  }

  multiplyByMatrix(that: Matrix): Vector {
    let product: Vector = new Vector(0, 0, 0, 0);

    for (let x = 0; x < this.size; x++) {
      let sum: number = 0;

      for (let y = 0; y < this.size; y++) {
        sum += this.getElement(y) * that.getElement(y, x);
      }

      product.setElement(x, sum);
    }

    return product;
  }

  crossProduct(that: Vector): Vector {
    // Only using 3 dimensions here...
    let product: Vector = new Vector(0, 0, 0, 1.0);

    product.setElement(0, this.getElement(1) * that.getElement(2) - this.getElement(2) * that.getElement(1));
    product.setElement(1, this.getElement(2) * that.getElement(0) - this.getElement(0) * that.getElement(2));
    product.setElement(2, this.getElement(0) * that.getElement(1) - this.getElement(1) * that.getElement(0));

    return product;
  }

  dotProduct(that: Vector): number {
    return this.getElement(0) * that.getElement(0) +
           this.getElement(1) * that.getElement(1) +
           this.getElement(2) * that.getElement(2);
  }

  toUnit(): Vector {
    let magnitude: number = this.magnitude();

    let unitVector: Vector = new Vector(
      this.getElement(0) / magnitude,
      this.getElement(1) / magnitude,
      this.getElement(2) / magnitude,
      this.getElement(3)
    );

    return unitVector;
  }

  subtract(that: Vector): Vector {
    return new Vector(
      this.getElement(0) - that.getElement(0),
      this.getElement(1) - that.getElement(1),
      this.getElement(2) - that.getElement(2),
      1.0
    );
  }

  magnitude(): number {
    return Math.sqrt(Math.pow(this.getElement(0), 2) +
                     Math.pow(this.getElement(1), 2) +
                     Math.pow(this.getElement(2), 2));
  }

  scaleToOne(): Vector {
    let scale: number = this.getElement(3);

    return new Vector(
      this.getElement(0) / scale,
      this.getElement(1) / scale,
      this.getElement(2) / scale,
      this.getElement(3) / scale
    );
  }

  format(): string {
    let scaledVector: Vector = this.scaleToOne();
    // let scaledVector: Vector = this;

    return "[ " + scaledVector.getElement(0) + ", " + scaledVector.getElement(1) + ", " + scaledVector.getElement(2) + ", " + scaledVector.getElement(3) + " ]";
  }
}
