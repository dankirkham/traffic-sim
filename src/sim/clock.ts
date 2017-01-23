export default class Clock {
  private time: number;
  public static MinutesPerDay: number = 1440;

  constructor() {
    this.time = 0;
  }

  tick(): void {
    this.time = (this.time + 1) % Clock.MinutesPerDay;
  }

  getTime(): number {
    return this.time;
  }
}
