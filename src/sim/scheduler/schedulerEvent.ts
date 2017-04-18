import SchedulerEventType from "./schedulerEventType";
import Person from "../../elements/person";

export default class SchedulerEvent {
  private person: Person;
  private minute: number;
  private type: SchedulerEventType;
  // Whether or not the event happens on the nextDay. On a new day all nextDay flags are set to false.
  private nextDay: boolean;

  public static compare = function (a, b) {
      if (a.getMinute() < b.getMinute()) return -1;
      if (a.getMinute() > b.getMinute()) return 1;
      return 0;
  };

  public static valueOf = function (a) {
    return a.getMinute();
  }

  constructor(person: Person, minute: number, type: SchedulerEventType, nextDay: boolean) {
    this.person = person;
    this.minute = minute;
    this.type = type;
    this.nextDay = nextDay;
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

  getNextDay(): boolean {
    return this.nextDay;
  }

  setNextDay(nextDay: boolean) {
    this.nextDay = nextDay;
  }
}
