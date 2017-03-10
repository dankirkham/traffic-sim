import Person from "../../elements/person";
import Map from "../../elements/map";
import Intersection from "../../elements/intersection";
import SchedulerEventType from "../scheduler/schedulerEventType";

interface PathingAlgorithm {
  generatePath(person: Person, map: Map, type: SchedulerEventType): Intersection[];
}

export default PathingAlgorithm;
