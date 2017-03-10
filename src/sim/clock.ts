export default class Clock {
  private time: number;
  public static MinutesPerDay: number = 1440;
  public static DefaultStartTime: number = 360;

  constructor() {
    this.time = Clock.DefaultStartTime;
  }

  tick(): void {
    this.time = (this.time + 1) % Clock.MinutesPerDay;
  }

  getTime(): number {
    return this.time;
  }

  toString(): string {
    let hours: string = String(Math.floor(this.time / 60));
    let minutes: string = String(this.time % 60);

    if (hours.length == 1) {
      hours = '0' + hours;
    }

    if (minutes.length == 1) {
      minutes = '0' + minutes;
    }

    return hours + ':' + minutes;
  }
}
