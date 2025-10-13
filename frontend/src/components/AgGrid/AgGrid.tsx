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
