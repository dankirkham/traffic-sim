import NameData from "./nameData";
import FemaleNameData from "./femaleNameData";
import MaleNameData from "./maleNameData";

export default class NameGenerator {
  private static properName(nameData: typeof NameData): string {
    return nameData.proper[Math.floor(Math.random() * nameData.proper.length)];
  }

  private static prefixSuffixName(nameData: typeof NameData): string {
    let name: string;

    while (true) {
      let prefix: string = nameData.prefix[Math.floor(Math.random() * nameData.prefix.length)];
      let suffix: string = nameData.suffix[Math.floor(Math.random() * nameData.suffix.length)];

      name = prefix + suffix;

      for (let f of nameData.forbidden) {
        if (name == f) {
          continue;
        }
      }

      break;
    }

    return name;
  }

  static generate(): string {
    let nameData: typeof NameData;

    // 50% gender
    if (Math.floor(Math.random() * 2) == 0) {
      nameData = FemaleNameData;
    } else {
      nameData = MaleNameData;
    }

    // 1 in 20 proper name
    if (Math.floor(Math.random() * 20) == 0) {
      return NameGenerator.properName(nameData) + ' ' + NameGenerator.prefixSuffixName(nameData);
    } else {
      return NameGenerator.prefixSuffixName(nameData) + ' ' + NameGenerator.prefixSuffixName(nameData);
    }
  }
}
