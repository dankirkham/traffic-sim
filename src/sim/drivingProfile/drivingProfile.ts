abstract class DrivingProfile {
  // All DrivingProfile quantities are a value in [0, 1]

  // Attentiveness affects reaction time, how quickly the driver hesitates to
  // move after the car in front of them moves.
  abstract getAttentiveness(): number;

  // Aggressiveness affects how quickly the driver accelerates.
  abstract getAggressiveness(): number;

  // Recklessness affects how fast the driver drives.
  abstract getRecklessness(): number;

  // Returns name of DrivingProfile
  abstract getName(): string;
}

export default DrivingProfile;
