// Generates a web city

import Building from "../elements/building";
import Point from "../elements/point";
import Way from "../elements/way";
import Intersection from "../elements/intersection";
import IntersectionDistance from "../elements/intersectionDistance";
import Map from "../elements/map";
import MapGenerator from "./mapGenerator";
import MapGeneratorConfig from "./mapGeneratorConfig";

export default class WebMapGenerator extends MapGenerator {
  // private static findGroups(intersections: Intersection[], ways: Way[]): Intersection[][] {
  //   let groups: Intersection[][] = [];
  //
  //
  // }

  private static getClosestValidIntersection(intersection: Intersection, intersections: Intersection[], ways: Way[], config: MapGeneratorConfig): Intersection {
    let intersectionDistances: IntersectionDistance[] = <IntersectionDistance[]> intersections.slice();

    // Calculate distance of each intersection
    for (let intersectionDistance of intersectionDistances) {
      intersectionDistance.distance = intersectionDistance.getLocation().getDistance(intersection.getLocation());
    }

    // Sort them by distance
    intersectionDistances = intersectionDistances.sort(IntersectionDistance.compareDistance);

    // Find closet intersection that is not already connected
    for (let intersectionDistance of intersectionDistances) {
      let way: Way = new Way(intersection, intersectionDistance);

      if (intersectionDistance.getWays().length >= config.maxWaysPerIntersection ||
          intersection.getWays().length >= config.maxWaysPerIntersection)
        // Intersection has too many ways.
        continue;

      if (intersection.isConnectedToIntersection(intersectionDistance))
        // Intersection is already connected.
        continue;

      if (way.getMinAngleBetweenWays(intersectionDistance.getWays()) < config.wayMinAngle ||
          way.getMinAngleBetweenWays(intersection.getWays()) < config.wayMinAngle) {
        // Intersection would result in a road too close in angle to another
        // road at the same intersection.
        continue;
      }

      if (way.isIntersectingWays(ways))
        // New way would intersect an old way.
        continue;

      // Intersection would result in a valid way. Return it.
      return intersectionDistance;
    }

    return undefined;
  }

  private static isIsolated(point: Point, intersections: Intersection[], config: MapGeneratorConfig): boolean {
    for (let intersection of intersections) {
      if (intersection.getLocation().getDistance(point) < config.intersectionMinDistance) {
        return false;
      }
    }

    return true;
  }

  static generate(config: MapGeneratorConfig) {
    let intersections: Intersection[] = [];
    let ways: Way[] = [];

    // Generate intersections
    let i: number = 1;
    while (i <= config.intersectionCount) {
      let location: Point = super.randomPoint(config.height, config.width);

      // Make sure Point is not too close to another intersection
      if (this.isIsolated(location, intersections, config)) {
        // Save intersection
        let intersection: Intersection = new Intersection(location);
        intersections.push(intersection);
        i += 1;
      }
    }

    // Generate ways for each intersection
    for (let intersection of intersections) {
      let intersectionWays: Way[] = intersection.getWays();

      while (intersectionWays.length < config.minWaysPerIntersection) {
        let closetIntersection: Intersection = this.getClosestValidIntersection(intersection, intersections, ways, config);

        if (closetIntersection) {
          let way: Way = new Way(intersection, closetIntersection);
          way.link();
          ways.push(way);
        } else {
          break;
        }
      }
    }

    // TODO: Determine groups. Generate ways to close the map.

    let map = new Map(config.height, config.width, intersections, ways);

    // Generate buildings
    super.generateBuildings(map, config);

    return map;
  }
}
