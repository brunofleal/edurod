import { Box, Button, HStack, Icon } from "@chakra-ui/react";
import React from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import { occurrencesMock } from "./setup/mock";
import { BsPlusCircle } from "react-icons/bs";
import NewOccurrencePage from "./NewOccurrenceModal/NewOccurrenceModal";

const OccurrencesPages = () => {
  return (
    <HStack>
      <AgGrid
        gridButtons={
          <HStack>
            <NewOccurrencePage />
          </HStack>
        }
        title="Ocorrencias"
        width={"100vw"}
        rowData={occurrencesMock}
        columnDefs={colDefs}
        defaultColDef={defaultColumnDef}
      />
    </HStack>
  );
};

export default OccurrencesPages;
