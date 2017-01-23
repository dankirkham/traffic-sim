import Camera from "../sim/camera";
import CameraConfig from "../sim/cameraConfig";
import KeyHandler from "../sim/keyHandler";
import MouseHandler from "../sim/mouseHandler";
import Map from "../elements/map";
import World from "../elements/world";
import Scheduler from "../sim/scheduler/scheduler";
import SchedulerEventType from "../sim/scheduler/schedulerEventType";
import NameGenerator from "./name/nameGenerator";
import EarlyBird from "../sim/chronotype/earlyBird";
import LateRiser from "../sim/chronotype/lateRiser";
import Punctual from "../sim/chronotype/punctual";
import Building from "../elements/building";
import {BuildingType} from "../elements/buildingType";
import Person from "../elements/person";

export default class WorldGenerator {
  private static initializeInput(canvas: HTMLCanvasElement, camera: Camera): void {
    let mouseHandler: MouseHandler = new MouseHandler(camera);
    mouseHandler.bind(canvas);

    let keyHandler: KeyHandler = new KeyHandler();
    keyHandler.bind(canvas);
    camera.setKeyHandler(keyHandler);
  }

  private static initializeScheduler(world: World): void {
    let scheduler: Scheduler = new Scheduler();
    world.setScheduler(scheduler);

    for (let person of world.getPersons()) {
      scheduler.schedule(person, SchedulerEventType.HomeToWork);
    }
  }

  private static initializeCamera(world: World): void {
    let cameraConfig: CameraConfig = new CameraConfig();
    let camera: Camera = new Camera(cameraConfig);

    // Center camera
    camera.getLocation().setX(world.getMap().getWidth() / 2);
    camera.getLocation().setY(world.getMap().getHeight() / 2);

    world.setCamera(camera);
  }

  private static generatePeople(world: World) {
    let residentialBuildings: Building[] = [];
    let industrialBuildings: Building[] = [];

    // Calculate max population for each type of building.
    // Also, build a list of each type of building.
    let populationResidential: number = 0;
    let populationIndustrial: number = 0;

    for (let building of world.getMap().getBuildings()) {
      if (building.getType() == BuildingType.Residential) {
        populationResidential += building.getCapacity();
        residentialBuildings.push(building);
      } else {
        populationIndustrial += building.getCapacity();
        industrialBuildings.push(building);
      }
    }

    // Generate Peeps
    let residentialCounter: number = 0;
    let industrialCounter: number = 0;

    while (residentialCounter < residentialBuildings.length && industrialCounter < industrialBuildings.length) {
      let person: Person = new Person(NameGenerator.generate());

      person.setHome(residentialBuildings[residentialCounter]);
      person.setWork(industrialBuildings[industrialCounter]);

      person.link();

      world.addPerson(person);

      if (residentialBuildings[residentialCounter].getCapacity() <= residentialBuildings[residentialCounter].getPersons().length) {
        residentialCounter += 1;
      }

      if (industrialBuildings[industrialCounter].getCapacity() <= industrialBuildings[industrialCounter].getPersons().length) {
        industrialCounter += 1;
      }
    }

    // Generate Chronotypes
    for (let person of world.getPersons()) {
      let rng: number = Math.floor(Math.random() * 3);

      switch (rng) {
        case 0:
          person.setChronotype(EarlyBird);
          break;
        case 1:
          person.setChronotype(LateRiser);
          break;
        default:
          person.setChronotype(Punctual);
      }
    }
  }

  static generate(canvas: HTMLCanvasElement, map: Map): World {
    let world: World = new World();
    world.setMap(map);

    WorldGenerator.generatePeople(world);

    WorldGenerator.initializeScheduler(world);
    WorldGenerator.initializeCamera(world);
    WorldGenerator.initializeInput(canvas, world.getCamera());

    return world;
  }
}
