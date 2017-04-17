import World from "../elements/world";
import NameGenerator from "./name/nameGenerator";
import Chronotype from "../sim/chronotype/chronotype";
import EarlyBird from "../sim/chronotype/earlyBird";
import LateRiser from "../sim/chronotype/lateRiser";
import Punctual from "../sim/chronotype/punctual";
import Building from "../elements/building";
import {BuildingType} from "../elements/buildingType";
import Person from "../elements/person";
import PathingAlgorithm from '../sim/pathing/pathingAlgorithm';
import ManhattanPathingAlgorithm from '../sim/pathing/manhattanPathingAlgorithm';
import { CarColor } from '../elements/carColor';

export default class PersonGenerator {
  private static generateChronotype(): typeof Chronotype {
    let rng: number = Math.floor(Math.random() * 3);

    switch (rng) {
      case 0:
        return EarlyBird;
      case 1:
        return LateRiser;
      default:
        return Punctual;
    }
  }

  private static generatePathingAlgorithm(): PathingAlgorithm {
    return new ManhattanPathingAlgorithm();
  }

  private static generateCarColor(): CarColor {
    let rng: number = Math.floor(Math.random() * 9);

    switch (rng) {
      case 0:
        return CarColor.Purple;
      case 1:
        return CarColor.Yellow;
      case 2:
        return CarColor.White;
      case 3:
        return CarColor.Black;
      case 4:
        return CarColor.Orange;
      case 5:
        return CarColor.Brown;
      case 6:
        return CarColor.Green;
      case 7:
        return CarColor.Blue;
      default:
        return CarColor.Red;
    }
  }

  private static generatePerson(home: Building, work: Building, world: World): void {
    let person: Person = new Person(NameGenerator.generate());

    person.setHome(home);
    person.setWork(work);
    person.setChronotype(PersonGenerator.generateChronotype());
    person.setPathingAlgorithm(PersonGenerator.generatePathingAlgorithm());
    person.setCarColor(PersonGenerator.generateCarColor());

    // Link home and work buildings back to the person.
    person.link();

    world.addPerson(person);
  }

  public static generate(world: World) {
    let residentialBuildings: Building[] = [];
    let industrialBuildings: Building[] = [];

    // Build a list of each type of building.
    for (let building of world.getMap().getBuildings()) {
      if (building.getType() == BuildingType.Residential) {
        residentialBuildings.push(building);
      } else {
        industrialBuildings.push(building);
      }
    }

    // Generate Peeps
    let residentialCounter: number = 0;
    let industrialCounter: number = 0;

    while (residentialCounter < residentialBuildings.length && industrialCounter < industrialBuildings.length) {
      let home: Building = residentialBuildings[residentialCounter];
      let work: Building = industrialBuildings[industrialCounter];

      PersonGenerator.generatePerson(home, work, world);

      if (home.getCapacity() <= home.getPersons().length) {
        residentialCounter += 1;
      }

      if (work.getCapacity() <= work.getPersons().length) {
        industrialCounter += 1;
      }
    }
  }
}
