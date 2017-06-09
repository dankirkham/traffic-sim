import DrivingProfile from "./drivingProfile";

export default class Distracted extends DrivingProfile {
  getAttentiveness(): number {
    return 0.0;
  }

  getAggressiveness(): number {
    return 0.5;
  }

  getRecklessness(): number {
    return 0.5;
  }

  getName(): string {
    return 'Distracted';
  }
}
