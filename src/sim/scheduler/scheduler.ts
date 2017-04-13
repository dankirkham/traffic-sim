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
      this.schedule(person, SchedulerEventType.HomeToWork);
    }
  }

  schedule(person: Person, schedulerEventType: SchedulerEventType) {
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

    let event: SchedulerEvent = new SchedulerEvent(person, minute, schedulerEventType);

    ArrayUtils.insert(event, this.events, SchedulerEvent.compare);
  }

  tick(time: number, map: Map): void {
    // console.log('scheduler.tick() called for time ' + time + '; event count = ' + this.events.length);

    for (var i = this.events.length - 1; i >= 0; i--) {
      let event: SchedulerEvent = this.events[i];

      if (this.events[i].getMinute() <= time) {
        let person: Person = event.getPerson();
        // console.log('Scheduling ' + person.getName());

        let path: Intersection[] = person.getPathingAlgorithm().generatePath(person, map, event.getType());

        person.setPath(path);

        // TODO: Spawn car

        // Reschedule person
        if (event.getType() == SchedulerEventType.HomeToWork) {
          this.schedule(person, SchedulerEventType.WorkToHome);
        } else {
          this.schedule(person, SchedulerEventType.HomeToWork);
        }

        this.events.splice(i, 1);
      }
    }


    this.lastTime = time;
  }

  // DEBUG: GetEvents
  getEvents(): SchedulerEvent[] {
    return this.events;
  }
}
