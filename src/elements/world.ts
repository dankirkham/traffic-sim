import Map from "./map";
import Camera from "../sim/camera";
import Person from "./person";
import Scheduler from "../sim/scheduler/scheduler";
import Car from './car';

export default class World {
  private map: Map;
  private camera: Camera;
  private scheduler: Scheduler;
  private persons: Person[];
  private cars: Car[];

  constructor() {
    this.persons = [];
    this.cars = [];
  }

  getMap(): Map {
    return this.map;
  }

  setMap(map: Map): void {
    this.map = map;
  }

  getCamera(): Camera {
    return this.camera;
  }

  setCamera(camera: Camera): void {
    this.camera = camera;
  }

  getScheduler(): Scheduler {
    return this.scheduler;
  }

  setScheduler(scheduler: Scheduler): void {
    this.scheduler = scheduler;
  }

  getPersons() : Person[] {
    return this.persons;
  }

  addPerson(person: Person) {
    this.persons.push(person);
  }

  getCars(): Car[] {
    return this.cars;
  }
}
