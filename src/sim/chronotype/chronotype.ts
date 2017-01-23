import SchedulerEventType from "../scheduler/schedulerEventType";

abstract class Chronotype {
  public static STARTING_TIME: number = 480; // 0800 hours
  public static QUITING_TIME: number = 1020 // 1700 hours

  abstract getLeaveTime(schedulerEventType: SchedulerEventType): number;
  abstract getName(): string;
}

export default Chronotype;
