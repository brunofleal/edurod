import type { Driver } from "./driver";
import type Line from "./line";
import type { OccurrenceType } from "./occurrenceType";
import type Timestamp from "./timestamp";

export interface OccurrenceRegistry extends Timestamp {
    occurrenceType: OccurrenceType;
    driver: Driver;
    line: Line;
    isResolved: boolean;
}
