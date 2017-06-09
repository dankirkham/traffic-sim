import DrivingProfile from "./drivingProfile";

export default class Spirited extends DrivingProfile {
  getAttentiveness(): number {
    return 1.0;
  }

  getAggressiveness(): number {
    return 1.0;
  }

  getRecklessness(): number {
    return 0.7;
  }

  getName(): string {
    return 'Spirited';
  }
}
