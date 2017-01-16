import {BuildingType} from "../elements/buildingType";
import Person from "../elements/person";
import Point from "../elements/point"
import Way from "../elements/way";

export default class Building {
  protected location: Point;
  protected way: Way;
  protected type: BuildingType;
  protected persons: Person[];
  protected capacity: number;

  // Distance between way intersection0 and intersection1.
  // This is the closest point on the way to the building.
  // This works as the physical address of the building
  // 0 = at intersection0
  // 1 = at intersection1
  // 0.5 = halfway between two intersections
  protected distance: number;

  constructor(location: Point, way: Way, distance: number) {
    this.location = location;
    this.distance = distance;

    this.persons = [];

    this.setWay(way);
  }

  getLocation(): Point {
    return this.location;
  }

  setWay(way: Way) {
    this.way = way;
  }

  getWay(): Way {
    return this.way;
  }

  getDistance(): number {
    return this.distance;
  }

  getType(): BuildingType {
    return this.type;
  }

  setType(type: BuildingType): void {
    this.type = type;
  }

  link() {
    if (this.way)
      this.way.addBuilding(this);
  }

  getPersons(): Person[] {
    return this.persons;
  }

  addPerson(person: Person): void {
    if (person && this.persons.indexOf(person) == -1) {
      this.persons.push(person);
    }
  }

  getCapacity(): number {
    return this.capacity;
  }

  setCapacity(capacity: number): void {
    this.capacity = capacity;
  }
}
