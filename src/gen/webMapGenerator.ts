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

  private static wayIntersects(way: Way, ways: Way[]): boolean {
    for (let w of ways) {
      if (w.isIntersecting(way)) {
        // If the ways share endpoints, they are technically intersecting,
        // but we make an exception here and say that they aren't.
        if (!way.isConnectedToWay(w)) {
          return true;
        }
      }
    }
    return false;
  }

  private static getClosestIntersections(intersection: Intersection, intersections: Intersection[], count: number, ways: Way[]): Intersection[] {
    let intersectionDistances: IntersectionDistance[] = <IntersectionDistance[]> intersections;

    // Calculate distance of each intersection
    for (let intersectionDistance of intersectionDistances) {
      intersectionDistance.distance = intersectionDistance.getLocation().getDistance(intersection.getLocation());
    }

    // Sort them by distance
    intersectionDistances = intersectionDistances.sort(function (a, b) {
      if (a.distance > b.distance) {
        return 1;
      } else if (a.distance < b.distance) {
        return -1
      } else {
        return 0;
      }
    });

    // Find n closest intersections that aren't already connected. n = count
    let closestIntersections: Intersection[] = [];
    let i: number = 1;
    while (closestIntersections.length < count && i < intersectionDistances.length) {
      let way: Way = new Way(intersection, intersectionDistances[i] as Intersection);

      if (!intersection.isConnectedToIntersection(intersectionDistances[i]) && !this.wayIntersects(way, ways)) {
        closestIntersections.push(intersectionDistances[i]);
      }

      i += 1;
    }

    return closestIntersections;
  }

  static generate(config: MapGeneratorConfig) {
    let intersections: Intersection[] = [];
    let ways: Way[] = [];

    // Generate intersections
    for (let i = 1; i <= config.intersectionCount; i++) {
      let location: Point = super.randomPoint(config.height, config.width);

      let intersection: Intersection = new Intersection(location);

      intersections.push(intersection);
    }

    // Generate ways for each intersection
    for (let intersection of intersections) {
      let intersectionWays: Way[] = intersection.getWays();

      let destinationIntersections = this.getClosestIntersections(intersection, intersections, config.minWaysPerIntersection - intersectionWays.length, ways);

      for (let destinationIntersection of destinationIntersections) {
        let way: Way = new Way(intersection, destinationIntersection);

        ways.push(way);
      }
    }

    // TODO: Determine groups. Generate ways to close the map.

    let map = new Map(config.height, config.width, intersections, ways);

    // Generate buildings
    super.generateBuildings(map, config);

    return map;
  }
}
