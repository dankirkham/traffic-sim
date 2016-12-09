// Generates a grid city

import Building from "../elements/building";
import Point from "../elements/point";
import Way from "../elements/way";
import Intersection from "../elements/intersection";
import Map from "../elements/map";

let INTERSECTION_DISTANCE: number = 15;
let BUILDING_DISTANCE: number = 25;
let WAY_MAX_DISTANCE: number = 20;
let WAY_MIN_DISTANCE: number = 12;
let METERS_PER_BLOCK: number = 95;
let BUILDINGS: number = 300;

function randomPoint(height: number, width: number): Point {
  let x = Math.random() * width;
  let y = Math.random() * height;

  return new Point(x, y);
}

function testLocation(map: Map, location: Point): boolean {
  // Check all intersections for distance
  for (let intersection of map.getIntersections()) {
    let distance: number = location.getDistance(intersection.getLocation());

    if (distance < INTERSECTION_DISTANCE) {
      return false;
    }
  }

  // Check all buildings for distance
  for (let building of map.getBuildings()) {
    let distance: number = location.getDistance(building.getLocation());

    if (distance < BUILDING_DISTANCE) {
      return false;
    }
  }

  // Check all ways for distance and find closest way (for address generation)
  let closestWay: Way = null;
  for (let way of map.getWays()) {
    let distance: number = way.getDistance(location);

    if (distance < WAY_MIN_DISTANCE) {
      return false;
    }

    if (!closestWay || closestWay.getDistance(location) > distance) {
      closestWay = way;
    }
  }

  // Make sure building isn't too far from it's closest way
  if (closestWay.getDistance(location) > WAY_MAX_DISTANCE) {
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

function generateBuildings(map: Map, count: number) {
  for (let i = 1; i <= count; i++) {
    let success = false;

    while (!success) {
      let location = randomPoint(map.getHeight(), map.getWidth());

      if (testLocation(map, location)) {
        success = true;
      }
    }
  }
}

export function buildGrid(height, width) {
  let gridIntersections: Intersection[][] = [];
  let ways: Way[] = [];

  let xBlocks: number = Math.floor(width / METERS_PER_BLOCK);
  let yBlocks: number = Math.floor(height / METERS_PER_BLOCK);

  for (let x = 0; x <= xBlocks; x++) {
    gridIntersections[x] = [];
    for (let y = 0; y <= yBlocks; y++) {
      gridIntersections[x][y] = new Intersection(new Point(x * METERS_PER_BLOCK, y * METERS_PER_BLOCK));

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

  let map = new Map(height, width, intersections, ways);

  // Generate buildings
  generateBuildings(map, BUILDINGS);

  return map;
}
