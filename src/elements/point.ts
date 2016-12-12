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

  subtract(that: Point): Point {
    return new Point(this.getX() - that.getX(), this.getY() - that.getY());
  }

  dotProduct(that: Point): number {
    return this.getX() * that.getX() + this.getY() * that.getY();
  }

  magnitude(): number {
    return Math.sqrt(Math.pow(this.getX(), 2) + Math.pow(this.getY(), 2));
  }
}
