import SchedulerEventType from "./schedulerEventType";
import Person from "../../elements/person";

export default class SchedulerEvent {
  private person: Person;
  private minute: number;
  private type: SchedulerEventType;

  public static compare = function (a, b) {
      if (a.getMinute() < b.getMinute()) return -1;
      if (a.getMinute() > b.getMinute()) return 1;
      return 0;
  };

  public static valueOf = function (a) {
    return a.getMinute();
  }

  constructor(person: Person, minute: number, type: SchedulerEventType) {
    this.person = person;
    this.minute = minute;
    this.type = type;
  }

  getPerson(): Person {
    return this.person;
  }

  getMinute(): number {
    return this.minute;
  }

  getType(): SchedulerEventType {
    return this.type;
  }
}
