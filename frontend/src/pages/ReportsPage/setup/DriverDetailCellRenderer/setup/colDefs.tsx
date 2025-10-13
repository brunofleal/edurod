import type { ColDef } from "ag-grid-community";
import { formatDateToLocalTime } from "../../../../../shared/utils/formatDate";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Badge } from "@chakra-ui/react";
import type { OccurrenceRegistry } from "../../../../../interfaces/occurrenceRegistry";
export const colDefs: ColDef[] = [
    {
        headerName: "Ocorrência",
        field: "occurrence.name",
    },
    {
        headerName: "Pontos",
        field: "occurrence.points",
        width: 100,
        cellRenderer: ({
            data,
        }: CustomCellRendererProps<OccurrenceRegistry>) => {
            return <Badge variant="solid">{data?.occurrenceType.points}</Badge>;
        },
    },
    {
        headerName: "Linha",
        field: "line.name",
    },
    {
        headerName: "Data",
        field: "createdAt",
        width: 200,
        valueGetter: ({ data }) =>
            formatDateToLocalTime(data["createdAt"], { onlyDate: false }),
    },
    {
        headerName: "Status",
        field: "isResolved",
        width: 150,
        cellRenderer: ({ data }: CustomCellRendererProps) => {
            {
                const isResolved = data["isResolved"];
                return (
                    <Badge
                        variant={"solid"}
                        bgColor={isResolved ? "green" : "red"}
                    >
                        {isResolved ? "Fechado" : "Em Aberto"}
                    </Badge>
                );
            }
        },
    },
];
export const defaultColumnDef: ColDef = {
    filter: true,
    floatingFilter: true,
    width: 220,
    autoHeight: true,
};
