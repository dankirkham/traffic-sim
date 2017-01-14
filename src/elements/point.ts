export default class Point {
  x: number;
  y: number;

  constructor (x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }

  getDistance(that: Point): number {
    return Math.sqrt(Math.pow(this.getX() - that.getX(), 2) + Math.pow(this.getY() - that.getY(), 2));
  }

  getString(): string {
    return '(' + this.x + ', ' + this.y + ')';
  }

  setX(x: number) {
    this.x = x;
  }

  setY(y: number) {
    this.y = y;
  }

  add(that: Point): Point {
    return new Point(this.getX() + that.getX(), this.getY() + that.getY());
  }

  subtract(that: Point): Point {
    return new Point(this.getX() - that.getX(), this.getY() - that.getY());
  }

  dotProduct(that: Point): number {
    return this.getX() * that.getX() + this.getY() * that.getY();
  }

  magnitude(): number {
    return Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
  }

  scalarMultiply(scalar: number) {
    return new Point(this.getX() * scalar, this.getY() * scalar);
  }

  unit(): Point {
    if (this.magnitude() == 0) {
      return this;
    } else {
      return new Point(this.getX() / this.magnitude(), this.getY() / this.magnitude());
    }
  }

  rotate(angle: number): Point {
    let cos: number = -Math.sin(angle * Math.PI / 180);
    let sin: number = Math.cos(angle * Math.PI / 180);

    return new Point(this.getX() * sin + this.getY() * cos, this.getX() * cos - this.getY() * sin);
  }

  toString(): string {
    return '(' + this.getX() + ', ' + this.getY() + ')';
  }
}
