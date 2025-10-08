import { HStack } from "@chakra-ui/react";
import React from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import NewOccurrencePage from "./NewOccurrenceModal/NewOccurrenceModal";
import { useFetch } from "../../shared/hooks/useFetch";

const OccurrencesPages = () => {
    const { data, loading } = useFetch("/api/occurrences");

    const rowData = data ? data.data : [];
    console.log({ rowData });

    return (
        <HStack>
            <AgGrid
                gridButtons={
                    <HStack>
                        <NewOccurrencePage />
                    </HStack>
                }
                title="Ocorrências"
                width={"100vw"}
                rowData={rowData}
                columnDefs={colDefs}
                defaultColDef={defaultColumnDef}
                loading={loading}
            />
        </HStack>
    );
};

export default OccurrencesPages;
