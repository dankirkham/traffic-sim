import CameraConfig from "./cameraConfig";
import KeyHandler from "./keyHandler";
import Point from "../elements/point";
import Vector from "../graphics/util/vector";

export default class Camera {
  protected azimuth: number;
  protected elevation: number;
  protected range: number;

  protected location: Point;
  protected velocity: Point;

  protected config: CameraConfig;
  protected keyHandler: KeyHandler;

  constructor(config: CameraConfig) {
    this.azimuth = 0;
    this.elevation = 85;
    this.range = 850;

    this.location = new Point(0, 0);
    this.velocity = new Point(0, 0);

    this.config = config;
  }

  getAzimuth(): number {
    return this.azimuth;
  }

  setAzimuth(value: number) {
    this.azimuth = (value + 360) % 360;
  }

  getElevation(): number {
    return this.elevation;
  }

  setElevation(value: number) {
    if (value > this.config.getMaxElevation()) {
      this.elevation = this.config.getMaxElevation();
    } else if (value < this.config.getMinElevation()) {
      this.elevation = this.config.getMinElevation();
    } else {
      this.elevation = value;
    }
  }

  getRange(): number {
    return this.range;
  }

  setRange(value: number) {
    if (value > this.config.getMaxRange()) {
      this.range = this.config.getMaxRange();
    } else if (value < this.config.getMinRange()) {
      this.range = this.config.getMinRange();
    } else {
      this.range = value;
    }
  }

  getLocation(): Point {
    return this.location;
  }

  toString(): string {
    return '(' + this.getAzimuth() + ', ' + this.getElevation() + ', ' + this.getRange() + ')';
  }

  getConfig(): CameraConfig {
    return this.config;
  }

  setKeyHandler(keyHandler: KeyHandler): void {
    this.keyHandler = keyHandler;
  }

  private getAccelerationVector(): Point {
    let acceleration: Point = new Point(0, 0);

    if (!this.keyHandler) {
      return acceleration;
    }

    if (this.keyHandler.isPressingDirection(KeyHandler.DIRECTION_UP)) {
      acceleration = acceleration.add(new Point(0, -1));
    }

    if (this.keyHandler.isPressingDirection(KeyHandler.DIRECTION_LEFT)) {
      acceleration = acceleration.add(new Point(-1, 0));
    }

    if (this.keyHandler.isPressingDirection(KeyHandler.DIRECTION_DOWN)) {
      acceleration = acceleration.add(new Point(0, 1));
    }

    if (this.keyHandler.isPressingDirection(KeyHandler.DIRECTION_RIGHT)) {
      acceleration = acceleration.add(new Point(1, 0));
    }

    return acceleration.rotate(this.azimuth).unit().scalarMultiply(this.config.getAcceleration());
  }

  tick(millis: number): void {
    let friction: Point;
    let acceleration: Point;

    if (this.config.getFriction() * 0.001 * millis > this.velocity.magnitude()) {
      // Stop jitter at low velocity
      friction = this.velocity.scalarMultiply(-1);
    } else {
      friction = this.velocity.unit().scalarMultiply(-this.config.getFriction() * 0.001 * millis);
    }

    if (this.keyHandler && this.keyHandler.isMoving()) {
      acceleration = this.getAccelerationVector().scalarMultiply(0.001 * millis).add(friction);
    } else {
      acceleration = friction;
    }

    this.velocity = this.velocity.add(acceleration);

    // Speed limiter
    let speed: number = this.velocity.magnitude();
    if (speed > this.config.getMaxVelocity()) {
      this.velocity = this.velocity.scalarMultiply(this.config.getMaxVelocity() / speed);
    }

    this.location = this.location.add(this.velocity.scalarMultiply(0.001 * millis));

    // TODO: Limit camera travel to edges of map
  }
}
