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
} from "@chakra-ui/react";
import { axiosApi } from "../../../shared/axiosApi";
import { toast } from "react-toastify";
import ComboBox from "../../../components/ComboBox/ComboBox";
import { BsPlus } from "react-icons/bs";
import { useState as useReactState } from "react";

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
    const [form, setForm] = useState<{
        description: string;
        occurrenceCategory: any;
    }>({ description: "", occurrenceCategory: null });
    const [formKey, setFormKey] = useState(0);
    const [editRowId, setEditRowId] = useReactState<string | null>(null);
    const [editForm, setEditForm] = useReactState<{
        description: string;
        occurrenceCategory: any;
    }>({
        description: "",
        occurrenceCategory: null,
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
        if (!form.description || !form.occurrenceCategory) {
            toast.error("Preencha todos os campos");
            return;
        }
        setLoading(true);
        try {
            const payload = {
                description: form.description,
                occurrenceCategory: form.occurrenceCategory.value,
            };
            await axiosApi.post("/api/occurrenceTypes", payload);
            toast.success("Tipo de ocorrência adicionado com sucesso!");
            setForm({ description: "", occurrenceCategory: null });
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
            await axiosApi.put(`/api/occurrenceTypes/${id}`, {
                description: updated.description,
                occurrenceCategory:
                    typeof updated.occurrenceCategory === "string"
                        ? updated.occurrenceCategory
                        : (updated.occurrenceCategory as OccurrenceCategory)
                              ._id,
            });
            toast.success("Tipo de ocorrência atualizado");
            fetchData();
        } catch (err) {
            toast.error("Erro ao atualizar tipo de ocorrência");
        }
        setLoading(false);
    };

    const colDefs = [
        { field: "description", headerName: "Descrição", editable: true },
        {
            field: "occurrenceCategory",
            headerName: "Categoria",
            valueGetter: (params: any) =>
                params.data.occurrenceCategory?.name || "",
        },
        {
            headerName: "Ações",
            cellRenderer: (params: any) => {
                const isEditing = editRowId === params.data._id;
                return isEditing ? (
                    <HStack>
                        <Input
                            w="120px"
                            value={editForm.description}
                            onChange={(e) =>
                                setEditForm({
                                    ...editForm,
                                    description: e.target.value,
                                })
                            }
                        />
                        <ComboBox
                            label="Categoria"
                            placeholder="Categoria"
                            options={categories.map((cat) => ({
                                value: cat._id,
                                label: `${cat.name} (${cat.points})`,
                            }))}
                            value={editForm.occurrenceCategory?.value || ""}
                            setValue={(val: string) => {
                                const option =
                                    categories
                                        .map((cat) => ({
                                            value: cat._id,
                                            label: `${cat.name} (${cat.points})`,
                                        }))
                                        .find((opt) => opt.value === val) ||
                                    null;
                                setEditForm({
                                    ...editForm,
                                    occurrenceCategory: option,
                                });
                            }}
                            loading={loading}
                        />
                        <Button
                            colorScheme="green"
                            size="sm"
                            onClick={async () => {
                                await handleEdit(params.data._id, {
                                    description: editForm.description,
                                    occurrenceCategory:
                                        editForm.occurrenceCategory.value,
                                });
                                setEditRowId(null);
                            }}
                        >
                            Salvar
                        </Button>
                        <Button
                            colorScheme="gray"
                            size="sm"
                            onClick={() => setEditRowId(null)}
                        >
                            Cancelar
                        </Button>
                    </HStack>
                ) : (
                    <HStack>
                        <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => {
                                setEditRowId(params.data._id);
                                setEditForm({
                                    description: params.data.description,
                                    occurrenceCategory: {
                                        value:
                                            params.data.occurrenceCategory
                                                ?._id ||
                                            params.data.occurrenceCategory,
                                        label:
                                            params.data.occurrenceCategory
                                                ?.name || "",
                                    },
                                });
                            }}
                        >
                            Editar
                        </Button>
                        <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(params.data._id)}
                        >
                            Excluir
                        </Button>
                    </HStack>
                );
            },
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
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />
                </VStack>
                <Box minW={200}>
                    <ComboBox
                        key={`cat-${formKey}`}
                        label="Categoria"
                        placeholder="Categoria"
                        options={categories.map((cat) => ({
                            value: cat._id,
                            label: `${cat.name} (${cat.points})`,
                        }))}
                        value={form.occurrenceCategory?.value || ""}
                        setValue={(val: string) => {
                            const option =
                                categories
                                    .map((cat) => ({
                                        value: cat._id,
                                        label: `${cat.name} (${cat.points})`,
                                    }))
                                    .find((opt) => opt.value === val) || null;
                            setForm({ ...form, occurrenceCategory: option });
                        }}
                        loading={loading}
                    />
                </Box>
                <Button
                    mt={6}
                    disabled={!form.description || !form.occurrenceCategory}
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
                onCellValueChanged={(params: any) => {
                    if (params.data._id) {
                        handleEdit(params.data._id, params.data);
                    }
                }}
            />
        </Box>
    );
};

export default CategoryGrid;
