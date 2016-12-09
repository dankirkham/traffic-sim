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

  print() {
    console.log('Point: (' + this.x + ', ' + this.y + ')');
  }
}
