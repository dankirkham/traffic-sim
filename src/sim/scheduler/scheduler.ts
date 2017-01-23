import SchedulerEvent from "./schedulerEvent";
import SchedulerEventType from "./schedulerEventType";
import Chronotype from "../chronotype/chronotype";
import EarlyBird from "../chronotype/earlyBird";
import Punctual from "../chronotype/punctual";
import LateRiser from "../chronotype/lateRiser";
import Person from "../../elements/person";
import SortUtils from "../../util/sortUtils";

export default class Scheduler {
  private events: SchedulerEvent[];

  private earlyBird: EarlyBird;
  private punctual: Punctual;
  private lateRiser: LateRiser;

  private static eventCompare = function (a, b) {
      if (a.getMinute() < b.getMinute()) return -1;
      if (a.getMinute() > b.getMinute()) return 1;
      return 0;
  };

  constructor() {
    this.events = [];

    this.earlyBird = new EarlyBird();
    this.punctual = new Punctual();
    this.lateRiser = new LateRiser();
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

    let event: SchedulerEvent = new SchedulerEvent(person, minute, schedulerEventType);

    SortUtils.insert(event, this.events, Scheduler.eventCompare);
  }
}
