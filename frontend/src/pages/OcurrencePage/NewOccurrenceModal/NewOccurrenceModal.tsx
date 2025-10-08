import {
    Button,
    CloseButton,
    Dialog,
    Grid,
    GridItem,
    Icon,
    Input,
    Portal,
    Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import ComboBox from "../../../components/ComboBox/ComboBox";
import { MenuLabels } from "./constants";
import { mockedSource } from "./mock";
import { useFetch } from "../../../shared/hooks/useFetch";
import { fromDataArrayToOption } from "./utils";

const DEFAULT_PLACEHOLDER = "Selecione uma opção";

const NewOccurrencePage = () => {
    // Options
    const { data: dataDrivers, loading: loadingDrivers } =
        useFetch("/api/drivers");
    const driverOptions = dataDrivers
        ? fromDataArrayToOption(dataDrivers.data, ["matricula", "name"], "_id")
        : [];

    const { data: dataOccurrenceTypes, loading: loadingOccurrenceType } =
        useFetch("/api/occurrenceTypes");
    const occurrenceTypeOptions = dataOccurrenceTypes
        ? fromDataArrayToOption(
              dataOccurrenceTypes.data,
              ["description"],
              "_id"
          )
        : [];

    const { data: dataLines, loading: loadingLines } = useFetch("/api/lines");
    const lineOptions = dataLines
        ? fromDataArrayToOption(dataLines.data, ["code", "description"], "_id")
        : [];

    // States

    return (
        <Dialog.Root size={"full"} closeOnInteractOutside={false}>
            <Dialog.Trigger asChild>
                <Button variant="solid">
                    <Icon>
                        <BsPlusCircle />
                    </Icon>
                    Adicionar Ocorrência
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content bgColor={"gray.100"}>
                        <Dialog.Header>
                            <Dialog.Title>
                                Registro de nova Ocorrência
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <form>
                                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Driver}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={driverOptions}
                                            loading={loadingDrivers}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Occurrence}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={occurrenceTypeOptions}
                                            loading={loadingOccurrenceType}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Line}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={lineOptions}
                                            loading={loadingLines}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Source}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={mockedSource}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Text mb={2}>Data e hora</Text>
                                        <Input type="datetime-local" />
                                    </GridItem>
                                </Grid>
                            </form>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancelar</Button>
                            </Dialog.ActionTrigger>
                            <Button>Salvar</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};

export default NewOccurrencePage;
