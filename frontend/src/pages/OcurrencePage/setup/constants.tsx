import type { ColDef } from "ag-grid-community";
import { formatDateToLocalTime } from "../../../shared/utils/formatDate";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Badge } from "@chakra-ui/react";
import type { OccurrenceRegistry } from "../../../interfaces/occurrenceRegistry";
import ActionsCellRenderer from "./ActionsCellRenderer";

export const colDefs: ColDef[] = [
    {
        headerName: "Ocorrência",
        field: "occurrenceType.description",
        width: 220,
    },
    {
        headerName: "Pontos",
        field: "occurrence.points",
        width: 80,
        cellRenderer: ({
            data,
        }: CustomCellRendererProps<OccurrenceRegistry>) => {
            return (
                <Badge variant="solid">
                    {data?.occurrenceType ? data?.occurrenceType.points : 0}
                </Badge>
            );
        },
    },
    {
        headerName: "Motorista",
        field: "driver",
        valueGetter: ({ data }) =>
            `${data.driver.matricula} | ${data.driver.name}`,
        width: 250,
    },
    {
        headerName: "Linha",
        field: "line",
        valueGetter: ({ data }) =>
            `${data.line.code} | ${data.line.description}`,
        width: 220,
    },
    {
        headerName: "Data da Ocorrência",
        field: "occurrenceDate",
        filter: false,
        width: 170,
        valueGetter: ({ data }) =>
            formatDateToLocalTime(data["occurrenceDate"], { onlyDate: true }),
    },
    {
        headerName: "Data de Registro",
        field: "creationDate",
        filter: false,
        width: 150,
        valueGetter: ({ data }) =>
            formatDateToLocalTime(data["creationDate"], { onlyDate: false }),
    },
    {
        headerName: "Data de Fechamento",
        field: "resolvedDate",
        filter: false,
        width: 170,
        valueGetter: ({ data }) =>
            data["resolvedDate"] && data["isResolved"]
                ? formatDateToLocalTime(data["resolvedDate"], {
                      onlyDate: false,
                  })
                : "-",
    },
    {
        headerName: "Descrição de Abertura",
        field: "description",
        width: 400,
        wrapText: true,
        autoHeight: true,
    },
    {
        headerName: "Comentário de Fechamento",
        field: "closingCommentary",
        width: 400,
        wrapText: true,
        autoHeight: true,
    },
    {
        headerName: "Criador",
        field: "createdBy.name",
        width: 200,
    },
    {
        headerName: "Último Modicador",
        field: "modifiedBy.name",
        width: 200,
    },
    {
        headerName: "Status",
        field: "isResolved",
        pinned: "right",
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
    {
        headerName: "Ações",
        field: "actions",
        pinned: "right",
        filter: false,
        width: 280,
        cellRenderer: ActionsCellRenderer,
    },
];
export const defaultColumnDef: ColDef = {
    filter: true,
    floatingFilter: true,
    width: 220,
    autoHeight: true,
};
