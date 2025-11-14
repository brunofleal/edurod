export interface OccurrenceCategory {
    name: string;
    points: number;
}

export interface OccurrenceType {
    _id: string;
    description: string;
    occurrenceCategory: OccurrenceCategory;
}
