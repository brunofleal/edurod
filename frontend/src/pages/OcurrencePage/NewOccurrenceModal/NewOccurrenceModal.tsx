import React, { useState } from "react";

import {
    Box,
    Button,
    CloseButton,
    Dialog,
    Field,
    Grid,
    GridItem,
    Icon,
    Portal,
    Text,
    Textarea,
} from "@chakra-ui/react";
import { BsPlusCircle } from "react-icons/bs";
import ComboBox from "../../../components/ComboBox/ComboBox";
import { MenuLabels } from "./constants";
import { mockedSource } from "./mock";
import { useFetch } from "../../../shared/hooks/useFetch";
import { fromDataArrayToOption } from "./utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import { pt } from "date-fns/locale/pt";
registerLocale("pt", pt);

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
              ["description", "points"],
              "_id"
          )
        : [];

    const { data: dataLines, loading: loadingLines } = useFetch("/api/lines");
    const lineOptions = dataLines
        ? fromDataArrayToOption(dataLines.data, ["code", "description"], "_id")
        : [];

    // States
    const [driver, setDriver] = useState();
    const [occurrenceType, setOccurrenceType] = useState();
    const [line, setLine] = useState();
    const [source, setSource] = useState();
    const [date, setDate] = useState<Date | null>(new Date());
    const [description, setDescription] = useState("");

    const isSaveDisabled =
        !driver || !occurrenceType || !line || !source || date;

    const handleSave = () => {
        const payload = {
            driver,
            occurrenceType,
            line,
            source,
            date,
            description,
        };
        console.log(payload);
    };

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
                            {isSaveDisabled ? (
                                <Text p={2} color="red">
                                    Todos os campos(*) devem ser preenchidos
                                </Text>
                            ) : (
                                <></>
                            )}
                        </Dialog.Header>
                        <Dialog.Body>
                            <form>
                                <Grid templateColumns="repeat(2, 1fr)" gap="6">
                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Driver}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={driverOptions}
                                            setValue={setDriver}
                                            loading={loadingDrivers}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Occurrence}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={occurrenceTypeOptions}
                                            setValue={setOccurrenceType}
                                            loading={loadingOccurrenceType}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Line}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={lineOptions}
                                            setValue={setLine}
                                            loading={loadingLines}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Source}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            setValue={setSource}
                                            options={mockedSource}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Field.Root>
                                            <Field.Label>
                                                Data da ocorrência*
                                            </Field.Label>
                                            <Box w={"200px"} h={"50px"}>
                                                <DatePicker
                                                    selected={date}
                                                    maxDate={new Date()}
                                                    onChange={(date) =>
                                                        setDate(date)
                                                    }
                                                    dateFormat="dd/MM/yyyy"
                                                    locale="pt-BR"
                                                    customInput={
                                                        <input
                                                            style={{
                                                                width: "100%",
                                                                height: "40px",
                                                                padding: "8px",
                                                                border: "1px solid #ccc",
                                                                borderRadius:
                                                                    "4px",
                                                            }}
                                                        />
                                                    }
                                                />
                                            </Box>
                                        </Field.Root>
                                    </GridItem>
                                    <GridItem>
                                        <Field.Root>
                                            <Field.Label>
                                                Informações Adicionais
                                            </Field.Label>
                                            <Textarea
                                                placeholder="Insira descrição(opcional)"
                                                onChange={(e) =>
                                                    setDescription(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </Field.Root>
                                    </GridItem>
                                </Grid>
                            </form>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancelar</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={handleSave}>Salvar</Button>
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
