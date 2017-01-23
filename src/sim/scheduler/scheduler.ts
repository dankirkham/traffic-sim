import SchedulerEvent from "./schedulerEvent";
import SchedulerEventType from "./schedulerEventType";
import Chronotype from "../chronotype/chronotype";
import EarlyBird from "../chronotype/earlyBird";
import Punctual from "../chronotype/punctual";
import LateRiser from "../chronotype/lateRiser";
import Person from "../../elements/person";
import ArrayUtils from "../../util/arrayUtils";

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

  tick(time: number): void {
    // TODO: Run pathing, spawn car



    this.lastTime = time;
  }

  // DEBUG: GetEvents
  getEvents(): SchedulerEvent[] {
    return this.events;
  }
}
