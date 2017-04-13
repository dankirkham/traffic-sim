import Building from "./building";
import Chronotype from "../sim/chronotype/chronotype";
import PathingAlgorithm from '../sim/pathing/pathingAlgorithm';
import Intersection from './intersection';

export default class Person {
  private name: string;
  private home: Building;
  private work: Building;
  private chronotype: typeof Chronotype;
  private pathingAlgorithm: PathingAlgorithm;

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public getHome(): Building {
    return this.home;
  }

  public setHome(building: Building): void {
    this.home = building;
  }

  public getWork(): Building {
    return this.work;
  }

  public setWork(building: Building): void {
    this.work = building;
  }

  public getChronotype(): typeof Chronotype {
    return this.chronotype;
  }

  public setChronotype(chronotype: typeof Chronotype) {
    this.chronotype = chronotype;
  }

  public getPathingAlgorithm(): PathingAlgorithm {
    return this.pathingAlgorithm;
  }

  public setPathingAlgorithm(pathingAlgorithm: PathingAlgorithm) {
    this.pathingAlgorithm = pathingAlgorithm;
  }

  public link(): void {
    if (this.home) {
      this.home.addPerson(this);
    }

    if (this.work) {
      this.work.addPerson(this);
    }
  }
}
