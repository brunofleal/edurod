import type { ColDef } from "ag-grid-community";
import DriverDetailCellRenderer from "./DriverDetailCellRenderer/DriverDetailCellRenderer";

export const colDefs: ColDef[] = [
  {
    headerName: "Motorista",
    field: "name",
  },
  {
    headerName: "Pontos",
    field: "points",
    width: 100,
  },
  {
    headerName: "Bônus",
    field: "bonus",
    width: 100,
  },
  {
    headerName: "Ocorrências",
    field: "totalOccurrences",
  },
  {
    headerName: "Ocorrências abertas",
    field: "totalUnresolvedOccurrences",
  },
  {
    headerName: "Ocorrência mais grave",
    field: "topOccurrence",
  },
  {
    headerName: "Principal Fonte de ocorrência",
    field: "occurrenceSource",
  },
  {
    headerName: "Detalhes",
    field: "detail",
    cellRenderer: DriverDetailCellRenderer,
  },
];

export const defaultColumnDef: ColDef = {
  filter: true,
  floatingFilter: true,
  width: 150,
  autoHeight: true,
};
