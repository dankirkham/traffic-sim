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
  intersectionDistance: number = 25;
  buildingDistance: number = 25;
  wayMaxDistance: number = 20;
  wayMinDistance: number = 12;
  // Number of buildings that will be generated
  buildingCount: number = 100;
  // END - Bulding options

  // BEGIN - WebMapGenerator Options
  // Number of intersections that will be generated.
  intersectionCount: number = 180;

  // Minimum number of roads that must meet an intersection. (Unless there aren't any possible options)
  minWaysPerIntersection: number = 3;

  // An Intersection must be this far away from another intersection.
  intersectionMinDistance: number = 50;

  // TODO: Forces ways meeting and intersection to be a certain angle apart.
  forceAngleSeparation: boolean = true;
  // END - WebMapGenerator Options

  // BEGIN - GridMapGenerator Options
  // Defines the size of a grid square.
  metersPerBlock: number = 95;
}
