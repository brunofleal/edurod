import type { ColDef } from "ag-grid-community";
import { formatDateToLocalTime } from "../../../shared/utils/formatDate";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Badge } from "@chakra-ui/react";
import type { OccurrenceRegistry } from "../../../interfaces/occurrenceRegistry";
import ActionsCellRenderer from "./ActionsCellRenderer";

export const colDefs: ColDef[] = [
    {
        headerName: "Data da Ocorrência",
        field: "occurrenceDate",
        filter: false,
        width: 170,
        valueGetter: ({ data }) =>
            formatDateToLocalTime(data["occurrenceDate"], { onlyDate: false }),
    },
    {
        headerName: "Linha",
        field: "line",
        valueGetter: ({ data }) =>
            data?.line ? `${data.line.code} | ${data.line.description}` : "-",
        width: 220,
    },
    {
        headerName: "Veículo",
        field: "vehicle",
        valueGetter: ({ data }) =>
            data?.vehicle
                ? `${data.vehicle.code} | ${data.vehicle.plate}| ${data.vehicle.nChassi}`
                : "-",
        width: 260,
    },
    {
        headerName: "Motorista",
        field: "driver.name",
        valueGetter: ({ data }) =>
            data?.driver
                ? `${data.driver.matricula} | ${data.driver.name}`
                : "-",
        width: 350,
        pinned: "left",
    },
    {
        headerName: "Ocorrência",
        field: "occurrenceType.description",
        valueGetter: ({ data }) =>
            data?.occurrenceType ? data.occurrenceType.description : "-",
        width: 220,
    },
    {
        headerName: "Categoria",
        field: "occurrenceType.occurrenceCategory.points",
        width: 160,
        valueGetter: ({ data }) =>
            data?.occurrenceType?.occurrenceCategory
                ? `${data.occurrenceType.occurrenceCategory.name}(${data.occurrenceType.occurrenceCategory.points})`
                : "-",
        cellRenderer: ({
            data,
        }: CustomCellRendererProps<OccurrenceRegistry>) => {
            return (
                <Badge variant="solid">
                    {data?.occurrenceType?.occurrenceCategory
                        ? `${data.occurrenceType.occurrenceCategory.name}(${data.occurrenceType.occurrenceCategory.points})`
                        : "-"}
                </Badge>
            );
        },
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
        valueGetter: ({ data }) =>
            data?.occurrenceType?.isResolved ? "Fechado" : "Em Aberto",
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
