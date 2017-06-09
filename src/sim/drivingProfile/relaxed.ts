import DrivingProfile from "./drivingProfile";

export default class Relaxed extends DrivingProfile {
  getAttentiveness(): number {
    return 0.5;
  }

  getAggressiveness(): number {
    return 0.5;
  }

  getRecklessness(): number {
    return 0.5;
  }

  getName(): string {
    return 'Relaxed';
  }
}
