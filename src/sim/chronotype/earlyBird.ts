import Chronotype from "./chronotype";
import SchedulerEventType from "../scheduler/schedulerEventType";

export default class EarlyBird extends Chronotype {
  getLeaveTime(schedulerEventType: SchedulerEventType): number {
    if (schedulerEventType == SchedulerEventType.HomeToWork) {
      return Chronotype.STARTING_TIME + Math.floor(Math.random() * (10 + 1) - 5) - 60;
    } else {
      return Chronotype.QUITING_TIME + Math.floor(Math.random() * (10 + 1) - 5) - 60;
    }
  }

  getName(): string {
    return 'Early Bird';
  }
}
