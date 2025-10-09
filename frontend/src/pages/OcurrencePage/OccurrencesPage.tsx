import { HStack } from "@chakra-ui/react";
import React from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import { colDefs, defaultColumnDef } from "./setup/constants";
import NewOccurrenceModal from "./NewOccurrenceModal/NewOccurrenceModal";
import { useFetch } from "../../shared/hooks/useFetch";
import { OccurrenceProvider } from "./OccurrenceContext";

const OccurrencesPages = () => {
    const { data, loading, refetch } = useFetch("/api/occurrences");

    const rowData = data ? data.data : [];

    return (
        <OccurrenceProvider refetch={refetch}>
            <HStack>
                <AgGrid
                    gridButtons={
                        <HStack>
                            <NewOccurrenceModal mode="create" />
                        </HStack>
                    }
                    title="Ocorrências"
                    width={"100vw"}
                    height={"85vh"}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColumnDef}
                    loading={loading}
                />
            </HStack>
        </OccurrenceProvider>
    );
};

export default OccurrencesPages;
