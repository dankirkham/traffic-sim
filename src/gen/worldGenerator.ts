import Camera from "../sim/camera";
import CameraConfig from "../sim/cameraConfig";
import KeyHandler from "../sim/keyHandler";
import MouseHandler from "../sim/mouseHandler";
import Map from "../elements/map";
import World from "../elements/world";
import Scheduler from "../sim/scheduler/scheduler";
import SchedulerEvent from "../sim/scheduler/schedulerEvent";
import SchedulerEventType from "../sim/scheduler/schedulerEventType";
import PersonGenerator from "./personGenerator";
import GridMapGenerator from "./map/gridMapGenerator";
import WebMapGenerator from "./map/webMapGenerator";
import MapGeneratorConfig from "./map/mapGeneratorConfig";
import ArrayUtils from "../util/arrayUtils";

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

    // TODO: This is a sample of the getElementsBetween function.
    ArrayUtils.getElementsBetween(450, 510, scheduler.getEvents(), SchedulerEvent.valueOf);
  }

  private static initializeCamera(world: World): void {
    let cameraConfig: CameraConfig = new CameraConfig();
    let camera: Camera = new Camera(cameraConfig);

    // Center camera
    camera.getLocation().setX(world.getMap().getWidth() / 2);
    camera.getLocation().setY(world.getMap().getHeight() / 2);

    world.setCamera(camera);
  }

  static generate(canvas: HTMLCanvasElement): World {
    let world: World = new World();

    let config: MapGeneratorConfig = new MapGeneratorConfig();

    world.setMap(WebMapGenerator.generate(config));
    // world.setMap(GridMapGenerator.generate(config));

    PersonGenerator.generate(world);

    WorldGenerator.initializeScheduler(world);
    WorldGenerator.initializeCamera(world);
    WorldGenerator.initializeInput(canvas, world.getCamera());

    return world;
  }
}
