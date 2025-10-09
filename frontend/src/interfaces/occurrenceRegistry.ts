import type { UserInfo } from "../shared/models/user";
import type { Driver } from "./driver";
import type Line from "./line";
import type { OccurrenceType } from "./occurrenceType";

export interface OccurrenceRegistry {
    _id: string;
    occurrenceType: OccurrenceType;
    driver: Driver;
    line: Line;
    source: string;
    description: string;
    isResolved: boolean;
    occurrenceDate: string;
    creationDate: string;
    resolvedDate: string;
    createdBy: UserInfo;
    modifiedBy: UserInfo;
    closingCommentary?: string;
}
