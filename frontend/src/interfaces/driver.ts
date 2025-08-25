export interface Driver {
  name: string;
  code: string;
}

export interface DriverReport {
  name: string;
  points: number;
  bonus: number;
  totalOccurrences: number;
  totalUnresolvedOccurrences: number;
  topOccurrence: string;
  occurrenceSource: string;
}
