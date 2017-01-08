export default class CameraConfig {
  protected minElevation: number;
  protected maxElevation: number;

  protected minRange: number;
  protected maxRange: number;

  protected horizontalSensitivity: number;
  protected verticalSensitivity: number;
  protected zoomSensitivity: number;

  constructor() {
    this.minElevation = 1;
    this.maxElevation = 89.9;

    this.minRange = 10;
    this.maxRange = 1000;

    this.horizontalSensitivity = 0.4;
    this.verticalSensitivity = 0.4;
    this.zoomSensitivity = 0.083333333;
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
}
