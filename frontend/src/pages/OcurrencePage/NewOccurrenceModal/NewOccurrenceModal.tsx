import React, { useEffect, useState } from "react";

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
import { BsPen, BsPlusCircle } from "react-icons/bs";
import ComboBox from "../../../components/ComboBox/ComboBox";
import { MenuLabels, sourceOptions } from "./constants";
import { useFetch } from "../../../shared/hooks/useFetch";
import { fromDataArrayToOption } from "./utils";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { toast } from "react-toastify";

import { registerLocale, setDefaultLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import { axiosApi } from "../../../shared/axiosApi";
import type { OccurrenceRegistry } from "../../../interfaces/occurrenceRegistry";
import { useOccurrenceContext } from "../OccurrenceContext";

registerLocale("pt-BR", ptBR);
setDefaultLocale("pt-BR");

const DEFAULT_PLACEHOLDER = "Selecione uma opção";

interface Props {
    mode: "create" | "edit";
    editData?: OccurrenceRegistry;
}
const NewOccurrenceModal = ({ mode = "create", editData }: Props) => {
    const { refetch } = useOccurrenceContext();

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
    const [loadingSave, setLoadingSave] = useState(false);
    const [driver, setDriver] = useState<string>();
    const [occurrenceType, setOccurrenceType] = useState<string>();
    const [line, setLine] = useState<string>();
    const [source, setSource] = useState<string>();
    const [date, setDate] = useState<Date | null>(new Date());
    const [description, setDescription] = useState("");

    const handleSaveNew = () => {
        const payload = {
            driver,
            occurrenceType,
            line,
            source,
            occurrenceDate: date?.toISOString(),
            description,
        };
        setLoadingSave(true);
        axiosApi
            .post("/api/occurrences", payload)
            .then((response) => {
                toast.success("Ocorrência registrada com sucesso!");
            })
            .catch((error) => {
                toast.error("Falha no registro de ocorrência.");
                console.error(error);
            })
            .finally(() => {
                setLoadingSave(false);
                refetch();
            });
    };

    const handleEdit = () => {
        const payload = {
            driver,
            occurrenceType,
            line,
            source,
            occurrenceDate: date?.toISOString(),
            description,
            isResolved: false,
            resolvedDate: undefined,
        };
        setLoadingSave(true);
        axiosApi
            .patch(`/api/occurrences/${editData?._id}`, payload)
            .then((response) => {
                toast.success("Ocorrência editada com sucesso!");
            })
            .catch((error) => {
                toast.error("Falha na edição da ocorrência");
                console.error(error);
            })
            .finally(() => {
                setLoadingSave(false);
                refetch();
            });
    };

    useEffect(() => {
        if (editData) {
            setDriver(editData.driver?._id);
            setOccurrenceType(editData.occurrenceType?._id);
            setLine(editData.line?._id);
            setSource(editData.source || "");

            setDate(new Date(editData.occurrenceDate));
            setDescription(editData.description || "");
        }
    }, [editData]);

    const isSaveDisabled =
        !driver || !occurrenceType || !line || !source || !date;

    return (
        <Dialog.Root size={"full"} closeOnInteractOutside={false}>
            <Dialog.Trigger asChild>
                <Button variant="solid" size={mode == "create" ? "md" : "xs"}>
                    <Icon>
                        {mode == "create" ? <BsPlusCircle /> : <BsPen />}
                    </Icon>
                    {mode == "create" ? "Criar nova Ocorrência" : "Editar"}
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                {mode == "create"
                                    ? "Registro de nova "
                                    : "Editar "}
                                Ocorrência
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
                                            value={driver}
                                            setValue={setDriver}
                                            loading={loadingDrivers}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Occurrence}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={occurrenceTypeOptions}
                                            value={occurrenceType}
                                            setValue={setOccurrenceType}
                                            loading={loadingOccurrenceType}
                                        />
                                    </GridItem>

                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Line}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={lineOptions}
                                            value={line}
                                            setValue={setLine}
                                            loading={loadingLines}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <ComboBox
                                            label={MenuLabels.Source}
                                            placeholder={DEFAULT_PLACEHOLDER}
                                            options={sourceOptions}
                                            value={source}
                                            setValue={setSource}
                                            loading={false}
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
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={15}
                                                    dateFormat="dd/MM/yyyy HH:mm"
                                                    locale="pt-BR"
                                                    popperPlacement="right-start"
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
                                                value={description}
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
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    onClick={() =>
                                        mode == "create"
                                            ? handleSaveNew()
                                            : handleEdit()
                                    }
                                    loading={loadingSave}
                                    disabled={loadingSave || isSaveDisabled}
                                >
                                    Salvar
                                </Button>
                            </Dialog.ActionTrigger>
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

export default NewOccurrenceModal;
