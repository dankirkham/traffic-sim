import Building from "../../elements/building";
import Way from "../../elements/way";
import Person from "../../elements/person";
import Point from "../../elements/point";
import Map from "../../elements/map";
import Intersection from "../../elements/intersection";
import SchedulerEventType from "../scheduler/schedulerEventType";
import PathingAlgorithm from "./pathingAlgorithm";

class ManhattanPathingAlgorithm implements PathingAlgorithm {
  private findNextWay(path: Intersection[], destinationBuilding: Building, depth: number): Intersection[] {
    let lastIntersection: Intersection = path[path.length - 1];

    for (let way of lastIntersection.getWays()) {
      if (way.getBuildings().indexOf(destinationBuilding) > -1) {
        return path;
      }
    }

    // Build list of intersections connected to passed intersection.
    let validNextIntersections: Intersection[] = [];
    for (let way of lastIntersection.getWays()) {
      let otherIntersection: Intersection = way.getOtherIntersection(lastIntersection);

      if (path.indexOf(otherIntersection) === -1) {
        validNextIntersections.push(otherIntersection);
      }
    }

    // Sort next intersections by distance to destinationBuilding
    let buildingPosition: Point = destinationBuilding.getWay().getLocationOfAddress(destinationBuilding.getDistance());
    validNextIntersections.sort(function (a, b) {
      return a.getLocation().getDistance(buildingPosition) - b.getLocation().getDistance(buildingPosition);
    });

    for (let nextIntersection of validNextIntersections) {
      let clonedPath: Intersection[] = path.slice();
      clonedPath.push(nextIntersection);

      let nextPath: Intersection[] = this.findNextWay(clonedPath, destinationBuilding, depth + 1);

      if (nextPath) {
        return nextPath;
      }
    }

    return null;
  }

  public generatePath(person: Person, map: Map, type: SchedulerEventType): Intersection[] {
    let path: Intersection[] = [];
    let startBuilding: Building;
    let endBuilding: Building;

    // Set start and end buildings, are we going home or going to work?
    if (type === SchedulerEventType.HomeToWork) {
      startBuilding = person.getHome();
      endBuilding = person.getWork();
    } else if (type === SchedulerEventType.WorkToHome) {
      startBuilding = person.getWork();
      endBuilding = person.getHome();
    }

    // Going to run the recursive pather with the intersection that is closest to the building.
    let firstIntersection: Intersection;

    if (startBuilding.getDistance() >= 0.5) {
      firstIntersection = startBuilding.getWay().getIntersection(0);
    } else {
      firstIntersection = startBuilding.getWay().getIntersection(1);
    }

    return this.findNextWay([firstIntersection], endBuilding, 1);
  }
}

export default ManhattanPathingAlgorithm;
