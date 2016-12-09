import Building from "./building";
import Intersection from "./intersection";
import Way from "./way";

export default class Map {
  intersections: Intersection[];
  ways: Way[];
  buildings: Building[];
  height: number;
  width: number;

  constructor(height: number, width: number, intersections: Intersection[], ways: Way[]) {
    this.height = height;
    this.width = width;
    this.intersections = intersections;
    this.ways = ways;
    this.buildings = [];
  }

  getHeight(): number {
    return this.height;
  }

  getWidth(): number {
    return this.width;
  }

  getIntersections(): Intersection[] {
    return this.intersections;
  }

  getWays(): Way[] {
    return this.ways;
  }

  getBuildings(): Building[] {
    return this.buildings;
  }

  addBuilding(building: Building) {
    this.buildings.push(building);
  }
}
