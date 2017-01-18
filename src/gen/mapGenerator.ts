import Building from "../elements/building";
import {BuildingType} from "../elements/buildingType";
import Person from "../elements/person";
import Point from "../elements/point";
import Way from "../elements/way";
import Intersection from "../elements/intersection";
import Map from "../elements/map";
import MapGeneratorConfig from "./mapGeneratorConfig"
import NameGenerator from "./name/nameGenerator";

export default class MapGenerator {
  static randomPoint(height: number, width: number): Point {
    let x = Math.random() * width;
    let y = Math.random() * height;

    return new Point(x, y);
  }

  static testLocation(map: Map, location: Point, config: MapGeneratorConfig): boolean {
    // Not too close to map edge
    if (location.getX() < config.mapEdgeDistance ||
        location.getX() > config.width - config.mapEdgeDistance ||
        location.getY() < config.mapEdgeDistance ||
        location.getY() > config.height - config.mapEdgeDistance)
      return false;

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

    // Save building
    let building: Building = new Building(location, closestWay, address);
    building.link();
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

    // Allocate buildings
    let residentialCount: number = Math.floor(map.getBuildings().length * config.percentResidential / 100);
    let residentialBuildings: Building[] = [];
    let industrialBuildings: Building[] = [];

    for (let building of map.getBuildings()) {
      if (residentialCount > 0) {
        building.setType(BuildingType.Residential);
        building.setCapacity(Math.floor(Math.random() * (config.maxCapacityResidential - config.minCapacityResidential + 1)) + config.minCapacityResidential);
        residentialBuildings.push(building);

        residentialCount -= 1;
      } else {
        building.setType(BuildingType.Industrial);
        building.setCapacity(Math.floor(Math.random() * (config.maxCapacityIndustrial - config.minCapacityIndustrial + 1)) + config.minCapacityIndustrial);
        industrialBuildings.push(building);
      }
    }

    // DEBUG: Calculate max population for each type of building
    let populationResidential: number = 0;
    let populationIndustrial: number = 0;

    for (let building of map.getBuildings()) {
      if (building.getType() == BuildingType.Residential) {
        populationResidential += building.getCapacity();
      } else {
        populationIndustrial += building.getCapacity();
      }
    }

    // Generate Peeps
    let residentialCounter: number = 0;
    let industrialCounter: number = 0;

    while (residentialCounter < residentialBuildings.length && industrialCounter < industrialBuildings.length) {
      let person: Person = new Person(NameGenerator.generate());

      person.setHome(residentialBuildings[residentialCounter]);
      person.setWork(industrialBuildings[industrialCounter]);

      person.link();

      map.addPerson(person);

      if (residentialBuildings[residentialCounter].getCapacity() <= residentialBuildings[residentialCounter].getPersons().length) {
        residentialCounter += 1;
      }

      if (industrialBuildings[industrialCounter].getCapacity() <= industrialBuildings[industrialCounter].getPersons().length) {
        industrialCounter += 1;
      }
    }
  }
}
