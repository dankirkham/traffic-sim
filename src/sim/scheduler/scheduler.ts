import SchedulerEvent from "./schedulerEvent";
import SchedulerEventType from "./schedulerEventType";
import Chronotype from "../chronotype/chronotype";
import EarlyBird from "../chronotype/earlyBird";
import Punctual from "../chronotype/punctual";
import LateRiser from "../chronotype/lateRiser";
import Person from "../../elements/person";
import ArrayUtils from "../../util/arrayUtils";
import Map from '../../elements/map';
import Intersection from '../../elements/intersection';
import World from '../../elements/world';
import Building from '../../elements/building';
import Way from '../../elements/way';
import Car from '../../elements/car';

export default class Scheduler {
  private events: SchedulerEvent[];

  private earlyBird: EarlyBird;
  private punctual: Punctual;
  private lateRiser: LateRiser;

  private lastTime: number;

  constructor() {
    this.events = [];

    this.earlyBird = new EarlyBird();
    this.punctual = new Punctual();
    this.lateRiser = new LateRiser();

    this.lastTime = 0;
  }

  init(persons: Person[]) {
    // Schedules every person to leave for work
    for (let person of persons) {
      this.schedule(person, SchedulerEventType.HomeToWork, false);
    }
  }

  schedule(person: Person, schedulerEventType: SchedulerEventType, nextDay: boolean) {
    let minute: number;

    if (person.getChronotype() == EarlyBird) {
      minute = this.earlyBird.getLeaveTime(schedulerEventType);
    } else if (person.getChronotype() == Punctual) {
      minute = this.punctual.getLeaveTime(schedulerEventType);
    } else {
      minute = this.lateRiser.getLeaveTime(schedulerEventType);
    }

    // TODO: I would much rather do it this way. Perhaps this can be done by making Chronotype and interface and not a class.
    // minute = person.getChronotype().getLeaveTime(schedulerEventType);

    let event: SchedulerEvent = new SchedulerEvent(person, minute, schedulerEventType, nextDay);

    ArrayUtils.insert(event, this.events, SchedulerEvent.compare);
  }

  tick(time: number, world: World): void {
    // console.log('scheduler.tick() called for time ' + time + '; event count = ' + this.events.length);
    if (time < this.lastTime) {
      // New day
      for (let event of this.events) {
        event.setNextDay(false);
      }
    }


    for (var i = this.events.length - 1; i >= 0; i--) {
      let event: SchedulerEvent = this.events[i];

      if (!event.getNextDay() && event.getMinute() > this.lastTime && event.getMinute() <= time) {
        let person: Person = event.getPerson();
        // console.log('Scheduling ' + person.getName());

        // Generate path
        let path: Intersection[] = person.getPathingAlgorithm().generatePath(person, world.getMap(), event.getType());

        // Find destination building and starting way
        let destination: Building;
        let startingWay: Way;

        if (event.getType() == SchedulerEventType.HomeToWork) {
          destination = person.getWork();
          startingWay = person.getHome().getWay();
        } else {
          destination = person.getHome();
          startingWay = person.getWork().getWay();
        }

        // Create car
        let car: Car = new Car(person, path, destination, startingWay);
        world.getCars().push(car);

        // Reschedule person
        if (event.getType() == SchedulerEventType.HomeToWork) {
          this.schedule(person, SchedulerEventType.WorkToHome, false);
        } else {
          this.schedule(person, SchedulerEventType.HomeToWork, true);
        }

        // Delete this event
        this.events.splice(i, 1);
      }
    }

    // TODO: Is lastTime used?
    this.lastTime = time;
  }

  // DEBUG: GetEvents
  getEvents(): SchedulerEvent[] {
    return this.events;
  }
}
