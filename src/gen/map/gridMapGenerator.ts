// Generates a grid city

import Building from "../../elements/building";
import Point from "../../elements/point";
import Way from "../../elements/way";
import Intersection from "../../elements/intersection";
import Map from "../../elements/map";
import MapGenerator from "./mapGenerator"
import MapGeneratorConfig from "./mapGeneratorConfig"

export default class GridMapGenerator extends MapGenerator {
  static generate(config: MapGeneratorConfig) {
    let gridIntersections: Intersection[][] = [];
    let ways: Way[] = [];

    let xBlocks: number = Math.floor(config.width / config.metersPerBlock);
    let yBlocks: number = Math.floor(config.height / config.metersPerBlock);

    for (let x = 0; x <= xBlocks; x++) {
      gridIntersections[x] = [];
      for (let y = 0; y <= yBlocks; y++) {
        gridIntersections[x][y] = new Intersection(new Point(x * config.metersPerBlock, y * config.metersPerBlock));

        if (x > 0) {
          ways.push(new Way(gridIntersections[x][y], gridIntersections[x - 1][y]));
        }

        if (y > 0) {
          ways.push(new Way(gridIntersections[x][y], gridIntersections[x][y - 1]));
        }
      }
    }

    // Serialize intersections
    let intersections: Intersection[] = [];
    for (let x = 0; x < xBlocks; x++) {
      for (let y = 0; y < yBlocks; y++) {
        intersections.push(gridIntersections[x][y]);
      }
    }

    let map = new Map(config.height, config.width, intersections, ways);

    // Generate buildings
    super.generateBuildings(map, config);

    return map;
  }
}
