export default class MapGeneratorConfig {
  // BEGIN - Map settings
  height: number = 855;
  width: number = 1520;
  // END - Map settings

  // BEGIN - Generator settings
  // TODO: Defines maximum times the generator will attempt an operation.
  // Prevents app freezing when attempting non-deterministic algorithms.
  operationMaxAttempts: number = 100;
  // END - Generator settings

  // BEGIN - Building options
  // Defines the distance a building can be from another object
  mapEdgeDistance: number = 25;
  intersectionDistance: number = 25;
  buildingDistance: number = 25;
  wayMaxDistance: number = 20;
  wayMinDistance: number = 12;
  // Number of buildings that will be generated
  buildingCount: number = 750;
  // END - Bulding options

  // BEGIN - WebMapGenerator Options
  // Number of intersections that will be generated.
  intersectionCount: number = 250;

  // Minimum number of roads that must meet an intersection. (Unless there aren't any possible options)
  minWaysPerIntersection: number = 4;

  // Absolute maximum ways per intersection
  maxWaysPerIntersection: number = 4;

  // An Intersection must be this far away from another intersection.
  intersectionMinDistance: number = 50;

  // Forces ways meeting at an intersection to be a certain angle apart.
  wayMinAngle: number = 30;
  // END - WebMapGenerator Options

  // BEGIN - GridMapGenerator Options
  // Defines the size of a grid square.
  metersPerBlock: number = 95;
}
