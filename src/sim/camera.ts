import CameraConfig from "./cameraConfig";
import Point from "../elements/Point";
import Vector from "../graphics/util/Vector";

export default class Camera {
  protected azimuth: number;
  protected elevation: number;
  protected range: number;

  protected origin: Point;

  protected config: CameraConfig;

  constructor(config: CameraConfig) {
    // this.azimuth = 270;
    // this.elevation = 45;
    // this.range = 750;

    this.azimuth = 225;
    this.elevation = 45;
    this.range = 2.5;

    this.origin = new Point(0, 0);

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

  getOrigin(): Point {
    return this.origin;
  }

  toString(): string {
    return '(' + this.getAzimuth() + ', ' + this.getElevation() + ', ' + this.getRange() + ')';
  }

  // toString(): string {
  //   return this.getPosition().format();
  // }

  getPosition(): Vector {
    return new Vector(
      // Math.cos(this.getElevation() * Math.PI / 180) * this.getRange() * Math.cos(this.getAzimuth() * Math.PI / 180) + this.getOrigin().getX(),
      // Math.cos(this.getElevation() * Math.PI / 180) * this.getRange() * Math.sin(this.getAzimuth() * Math.PI / 180) + this.getOrigin().getY(),
      Math.cos(this.getElevation() * Math.PI / 180) * this.getRange() * Math.cos(this.getAzimuth() * Math.PI / 180),
      Math.cos(this.getElevation() * Math.PI / 180) * this.getRange() * Math.sin(this.getAzimuth() * Math.PI / 180),
      Math.sin(this.getElevation() * Math.PI / 180) * this.getRange(),
      1.0
    );
  }

  getUp(): Vector {
    let upElevation: number = this.getElevation() + 90;
    let upAzimuth: number = this.getAzimuth();

    if (upElevation > 90) {
      upElevation = 180 - upElevation;
      upAzimuth = (upAzimuth + 180) % 360;
    }

    console.log(upElevation);

    let up: Vector =  new Vector(
      Math.cos(upElevation * Math.PI / 180) * this.getRange() * Math.cos(upAzimuth * Math.PI / 180),
      Math.cos(upElevation * Math.PI / 180) * this.getRange() * Math.sin(upAzimuth * Math.PI / 180),
      -Math.sin(upElevation * Math.PI / 180) * this.getRange(),
      1.0
    );

    return up.toUnit();
  }
}
