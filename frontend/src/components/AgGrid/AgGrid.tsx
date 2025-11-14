import { type JSX } from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import {
    AllCommunityModule,
    ModuleRegistry,
    themeAlpine,
} from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

interface Props extends AgGridReactProps {
    title?: string;
    children?: JSX.Element;
    height?: number | string;
    width?: number | string;
    gridButtons?: JSX.Element;
}
const AgGrid = ({
    title,
    children,
    gridButtons,
    height = "60vh",
    width = "100%",
    ...agGridProps
}: Props) => {
    const defaultAgGridProps: AgGridReactProps = {
        containerStyle: { width: "100%", height: "90%", color: "white" },
        theme: themeAlpine,
    };

    const localeText = {
        // General
        page: "Página",
        more: "Mais",
        to: "até",
        of: "de",
        next: "Próximo",
        last: "Último",
        first: "Primeiro",
        previous: "Anterior",
        loadingOoo: "Carregando...",
        // Set Filter
        selectAll: "Selecionar Todos",
        searchOoo: "Procurar...",
        blanks: "Em branco",
        // Number Filter & Text Filter
        filterOoo: "Filtrar...",
        applyFilter: "Aplicar",
        equals: "Igual",
        notEqual: "Diferente",
        lessThan: "Menor que",
        greaterThan: "Maior que",
        lessThanOrEqual: "Menor ou igual",
        greaterThanOrEqual: "Maior ou igual",
        inRange: "No intervalo",
        contains: "Contém",
        notContains: "Não contém",
        startsWith: "Começa com",
        endsWith: "Termina com",
        // Filter Conditions
        andCondition: "E",
        orCondition: "Ou",
        // Filter Buttons
        resetFilter: "Redefinir",
        clearFilter: "Limpar",
        cancelFilter: "Cancelar",
        // Columns Tool Panel
        columns: "Colunas",
        filters: "Filtros",
        // Side Bar
        noRowsToShow: "Nenhuma linha para mostrar",
        // Menu
        pinColumn: "Fixar Coluna",
        valueAggregation: "Agregação de Valor",
        autosizeThiscolumn: "Ajustar esta coluna",
        autosizeAllColumns: "Ajustar todas as colunas",
        groupBy: "Agrupar por",
        ungroupBy: "Desagrupar",
        resetColumns: "Redefinir colunas",
        expandAll: "Expandir tudo",
        collapseAll: "Recolher tudo",
        toolPanel: "Painel de Ferramentas",
        export: "Exportar",
        csvExport: "Exportar CSV",
        excelExport: "Exportar Excel",
        // Others
        copy: "Copiar",
        copyWithHeaders: "Copiar com cabeçalhos",
        paste: "Colar",
        // Add more as needed
    };

    return (
        <Box
            bgColor="gray.200"
            borderRadius="20px"
            p={8}
            width={width}
            height={height}
        >
            <HStack justifyContent="space-between">
                <Text fontSize={24} fontWeight="bold" mb={4}>
                    {title}
                </Text>
                {children}
                {gridButtons}
            </HStack>

            <AgGridReact
                {...defaultAgGridProps}
                {...agGridProps}
                localeText={localeText}
                onGridReady={(event) => {
                    //event.api.autoSizeAllColumns();
                    if (agGridProps.onGridReady) {
                        agGridProps.onGridReady(event);
                    }
                }}
            />
        </Box>
    );
};

export default AgGrid;
