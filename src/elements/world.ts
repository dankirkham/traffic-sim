import Map from "./map";
import Camera from "../sim/camera"

export default class World {
  private map: Map;
  private camera: Camera;

  getMap(): Map {
    return this.map;
  }

  setMap(map: Map): void {
    this.map = map;
  }

  getCamera(): Camera {
    return this.camera;
  }

  setCamera(camera: Camera): void {
    this.camera = camera;
  }
}
