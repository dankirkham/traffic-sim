export default class CameraConfig {
  protected minElevation: number;
  protected maxElevation: number;

  protected minRange: number;
  protected maxRange: number;

  protected horizontalSensitivity: number;
  protected verticalSensitivity: number;
  protected zoomSensitivity: number;

  protected minX: number;
  protected maxX: number;

  protected minY: number;
  protected maxY: number;

  protected acceleration: number;
  protected friction: number;
  protected maxVelocity: number;

  constructor() {
    this.minElevation = 15;
    this.maxElevation = 89.9;

    this.minRange = 50;
    this.maxRange = 1000;

    this.horizontalSensitivity = 0.4;
    this.verticalSensitivity = 0.4;
    this.zoomSensitivity = 0.083333333;

    this.minX = 0;
    this.maxX = 1520;

    this.minY = 0;
    this.maxY = 855;

    this.acceleration = 10000;
    this.friction = 5000;
    this.maxVelocity = 2000;
  }

  getMinElevation(): number {
    return this.minElevation;
  }

  getMaxElevation(): number {
    return this.maxElevation;
  }

  getMinRange(): number {
    return this.minRange;
  }

  getMaxRange(): number {
    return this.maxRange;
  }

  getHorizontalSensitivity(): number {
    return this.horizontalSensitivity;
  }

  getVerticalSensitivity(): number {
    return this.verticalSensitivity;
  }

  getZoomSensitivity(): number {
    return this.zoomSensitivity;
  }

  getMinX(): number {
    return this.minX;
  }

  getMaxX(): number {
    return this.maxX;
  }

  getMinY(): number {
    return this.minY;
  }

  getMaxY(): number {
    return this.maxY;
  }

  getAcceleration(): number {
    return this.acceleration;
  }

  getFriction(): number {
    return this.friction;
  }

  getMaxVelocity(): number {
    return this.maxVelocity;
  }
}
