import DrivingProfile from "./drivingProfile";

export default class Defensive extends DrivingProfile {
  getAttentiveness(): number {
    return 1.0;
  }

  getAggressiveness(): number {
    return 0.5;
  }

  getRecklessness(): number {
    return 0.3;
  }

  getName(): string {
    return 'Defensive';
  }
}
