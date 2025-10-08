import type { ColDef } from "ag-grid-community";
import { formatDateToLocalTime } from "../../../shared/utils/formatDate";
import type { CustomCellRendererProps } from "ag-grid-react";
import { Badge, ButtonGroup, Button, Icon } from "@chakra-ui/react";
import { BsArchive, BsPencil, BsTrash } from "react-icons/bs";
import type { OccurrenceRegistry } from "../../../interfaces/occurrenceRegistry";

export const colDefs: ColDef[] = [
    {
        headerName: "Ocorrência",
        field: "occurrenceType.description",
        width: 250,
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
        valueGetter: ({ data }) =>
            `${data.driver.matricula} | ${data.driver.name}`,
        width: 250,
    },
    {
        headerName: "Linha",
        valueGetter: ({ data }) =>
            `${data.line.code} | ${data.line.description}`,
        width: 200,
    },
    {
        headerName: "Data da Ocorrência",
        field: "occurrenceDate",
        width: 200,
        valueGetter: ({ data }) =>
            formatDateToLocalTime(data["occurrenceDate"], { onlyDate: false }),
    },
    {
        headerName: "Data de Registro",
        field: "creationDate",
        width: 150,
        valueGetter: ({ data }) =>
            formatDateToLocalTime(data["creationDate"], { onlyDate: false }),
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
        cellRenderer: ({
            data,
        }: CustomCellRendererProps<OccurrenceRegistry>) => {
            return (
                <ButtonGroup>
                    <Button size="xs" disabled={data?.isResolved}>
                        <Icon>
                            <BsArchive />
                        </Icon>
                        Fechar
                    </Button>
                    <Button size="xs" variant="outline">
                        <Icon>
                            <BsPencil />
                        </Icon>
                        Editar
                    </Button>
                    <Button
                        size="xs"
                        variant="outline"
                        bgColor="red"
                        color="white"
                    >
                        <Icon>
                            <BsTrash />
                        </Icon>
                        Deletar
                    </Button>
                </ButtonGroup>
            );
        },
    },
];
export const defaultColumnDef: ColDef = {
    filter: true,
    floatingFilter: true,
    width: 220,
    autoHeight: true,
};
