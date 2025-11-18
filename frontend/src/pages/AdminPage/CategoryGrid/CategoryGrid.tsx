import React, { useEffect, useState } from "react";
import AgGrid from "../../../components/AgGrid/AgGrid";
import {
    Box,
    Button,
    HStack,
    Input,
    Icon,
    Text,
    VStack,
    useDisclosure,
    Select,
    Portal,
    createListCollection,
} from "@chakra-ui/react";
import { axiosApi } from "../../../shared/axiosApi";
import { toast } from "react-toastify";
import { BsPlus } from "react-icons/bs";
import EditOccurrenceTypeModal from "./EditOccurrenceTypeModal";
import { ConfirmDialog } from "../../../components/ConfirmDialog/ConfirmDialog";
import Option from "../../../interfaces/option";

interface OccurrenceCategory {
    _id: string;
    name: string;
    points: number;
}

interface OccurrenceType {
    _id?: string;
    description: string;
    occurrenceCategory: string | OccurrenceCategory;
}

const CategoryGrid = () => {
    const [occurrenceTypes, setOccurrenceTypes] = useState<OccurrenceType[]>(
        []
    );
    const [categories, setCategories] = useState<OccurrenceCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<any | null>(null);
    const [formKey, setFormKey] = useState(0);
    const { open, onOpen, onClose } = useDisclosure();
    const [selectedOccurrenceType, setSelectedOccurrenceType] =
        useState<OccurrenceType | null>(null);

    const categoriesOptions: Option[] = categories.map((cat) => ({
        value: cat._id,
        label: `${cat.name} (${cat.points})`,
    }));

    const categoriesCollection = createListCollection({
        items: categoriesOptions,
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [typesRes, catsRes] = await Promise.all([
                axiosApi.get("/api/occurrenceTypes"),
                axiosApi.get("/api/occurrenceCategories"),
            ]);
            setOccurrenceTypes(typesRes.data.data);
            setCategories(catsRes.data.data);
        } catch (err) {
            toast.error("Erro ao buscar dados de tipos ou categorias");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAdd = async () => {
        if (!form?.description || !form?.occurrenceCategory) {
            toast.error("Preencha todos os campos");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                description: form?.description,
                occurrenceCategory: form?.occurrenceCategory.value,
            };
            await axiosApi.post("/api/occurrenceTypes", payload);
            toast.success("Tipo de ocorrência adicionado com sucesso!");
            setForm(null);
            setFormKey((k) => k + 1);
            fetchData();
        } catch (err) {
            toast.error("Erro ao adicionar tipo de ocorrência");
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            await axiosApi.delete(`/api/occurrenceTypes/${id}`);
            toast.success("Tipo de ocorrência removido");
            fetchData();
        } catch (err) {
            toast.error("Erro ao remover tipo de ocorrência");
        }
        setLoading(false);
    };

    const handleEdit = async (id: string, updated: OccurrenceType) => {
        setLoading(true);
        try {
            const payload = {
                description: updated.description,
                occurrenceCategory: updated.occurrenceCategory,
            };
            await axiosApi.put(`/api/occurrenceTypes/${id}`, payload);
            toast.success("Tipo de ocorrência atualizado");
            fetchData();
            onClose();
        } catch (err) {
            toast.error("Erro ao atualizar tipo de ocorrência");
            console.error("Edit error:", err);
        }
        setLoading(false);
    };

    const colDefs = [
        { field: "description", headerName: "Descrição", editable: true },
        {
            field: "occurrenceCategory",
            filter: true,
            headerName: "Categoria",
            valueGetter: (params: any) =>
                params.data.occurrenceCategory
                    ? `${params.data.occurrenceCategory?.name}(${params.data.occurrenceCategory?.points})`
                    : "-",
        },
        {
            headerName: "Ações",
            filter: true,
            cellRenderer: (params: any) => (
                <HStack>
                    <Button
                        size="sm"
                        onClick={() => {
                            setSelectedOccurrenceType(params.data);
                            onOpen();
                        }}
                    >
                        Editar
                    </Button>
                    <ConfirmDialog
                        onConfirm={() => handleDelete(params.data._id)}
                        openButton={{
                            label: "Deletar",
                            type: "delete",
                        }}
                        title={"Deletar Ocorrência"}
                        description={
                            "Tem certeza que deseja deletar esta ocorrência?"
                        }
                        saveLabel={"Deletar"}
                    />
                </HStack>
            ),
        },
    ];

    return (
        <Box>
            <HStack p={2} gap={1}>
                <VStack gap={0} align="start">
                    <Text>Descrição</Text>
                    <Input
                        w="150px"
                        key={`desc-${formKey}`}
                        placeholder="Descrição"
                        value={form?.description ?? ""}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                </VStack>
                <Box minW={200}>
                    <Text>Categoria</Text>
                    <Select.Root
                        key={`cat-${formKey}`}
                        collection={categoriesCollection}
                        value={
                            form?.occurrenceCategory
                                ? [form.occurrenceCategory.value]
                                : []
                        }
                        onValueChange={(details) =>
                            setForm({
                                ...form,
                                occurrenceCategory: details.value[0]
                                    ? {
                                          value: details.value[0],
                                          label:
                                              categoriesOptions.find(
                                                  (c) =>
                                                      c.value ===
                                                      details.value[0]
                                              )?.label || "",
                                      }
                                    : null,
                            })
                        }
                    >
                        <Select.HiddenSelect />
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Selecione a Categoria" />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content>
                                    {categoriesOptions.map((cat) => (
                                        <Select.Item
                                            item={cat.value}
                                            key={cat.value}
                                        >
                                            {cat.label}
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>
                </Box>
                <Button
                    mt={6}
                    disabled={!form?.description || !form?.occurrenceCategory}
                    onClick={handleAdd}
                    loading={loading}
                >
                    <Icon>
                        <BsPlus />
                    </Icon>
                    Adicionar Tipo
                </Button>
            </HStack>
            <AgGrid
                width={"90vw"}
                height={"75vh"}
                rowData={occurrenceTypes}
                columnDefs={colDefs}
                loading={loading}
            />
            <EditOccurrenceTypeModal
                isOpen={open}
                onClose={onClose}
                occurrenceType={selectedOccurrenceType}
                categories={categories}
                loading={loading}
                onSave={handleEdit}
            />
        </Box>
    );
};

export default CategoryGrid;
