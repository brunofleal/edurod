export interface Driver {
    _id: string;
    matricula: string;
    name: string;
    code: string;
}

export interface DriverReport {
    driver: Driver;
    points: number;
    bonus: number;
    totalOccurrences: number;
    totalUnresolvedOccurrences: number;
    topOccurrence: string;
    occurrenceSource: string;
}
