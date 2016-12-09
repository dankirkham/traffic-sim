import Building from "../elements/building";
import Point from "../elements/point";
import Way from "../elements/way";
import Intersection from "../elements/intersection";
import Map from "../elements/map";
import MapGeneratorConfig from "./mapGeneratorConfig"

export default class MapGenerator {
  static randomPoint(height: number, width: number): Point {
    let x = Math.random() * width;
    let y = Math.random() * height;

    return new Point(x, y);
  }

  static testLocation(map: Map, location: Point, config: MapGeneratorConfig): boolean {
    // Check all intersections for distance
    for (let intersection of map.getIntersections()) {
      let distance: number = location.getDistance(intersection.getLocation());

      if (distance < config.intersectionDistance) {
        return false;
      }
    }

    // Check all buildings for distance
    for (let building of map.getBuildings()) {
      let distance: number = location.getDistance(building.getLocation());

      if (distance < config.buildingDistance) {
        return false;
      }
    }

    // Check all ways for distance and find closest way (for address generation)
    let closestWay: Way = null;
    for (let way of map.getWays()) {
      let distance: number = way.getDistance(location);

      if (distance < config.wayMinDistance) {
        return false;
      }

      if (!closestWay || closestWay.getDistance(location) > distance) {
        closestWay = way;
      }
    }

    // Make sure building isn't too far from it's closest way
    if (closestWay.getDistance(location) > config.wayMaxDistance) {
      return false;
    }

    // Find address
    let address: number = closestWay.getAddress(location);
    console.log(address);

    // Save building
    let building: Building = new Building(location, closestWay, address);
    map.addBuilding(building);

    return true;
  }

  static generateBuildings(map: Map, config: MapGeneratorConfig) {
    for (let i = 1; i <= config.buildingCount; i++) {
      let success = false;

      while (!success) {
        let location = this.randomPoint(map.getHeight(), map.getWidth());

        if (this.testLocation(map, location, config)) {
          success = true;
        }
      }
    }
  }
}
