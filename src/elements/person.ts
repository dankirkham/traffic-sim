import Building from "./building";

export default class Person {
  private name: string;
  private home: Building;
  private work: Building;

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

  public link(): void {
    if (this.home) {
      this.home.addPerson(this);
    }

    if (this.work) {
      this.work.addPerson(this);
    }
  }
}
