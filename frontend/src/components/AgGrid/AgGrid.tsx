import { Box, Text } from "@chakra-ui/react";
import { AgGridReact, type AgGridReactProps } from "ag-grid-react";
import React from "react";

interface Props extends AgGridReactProps {
  title?: string;
}
const AgGrid = ({ title, ...agGridProps }: Props) => {
  const defaultAgGridProps: AgGridReactProps = {};

  return (
    <Box bgColor="red.100" borderRadius="20px" p={4}>
      <Text fontSize={32} fontWeight="bold">
        {title}
      </Text>
      <AgGridReact {...defaultAgGridProps} {...agGridProps} />
    </Box>
  );
};

export default AgGrid;
