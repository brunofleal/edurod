import type { Driver } from "./driver";
import type Line from "./line";
import type { Occurrence } from "./occurrence";
import type Timestamp from "./timestamp";

export interface OccurrenceRegistry extends Timestamp {
  occurrence: Occurrence;
  driver: Driver;
  line: Line;
  isResolved: boolean;
}
