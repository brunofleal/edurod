import { ButtonGroup, Textarea } from "@chakra-ui/react";
import { ConfirmDialog } from "../../../components/ConfirmDialog/ConfirmDialog";
import type { ColDef } from "ag-grid-community";
import { axiosApi } from "../../../shared/axiosApi";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { BsPen, BsTrash } from "react-icons/bs";

export const getEditDeleteActionsColDef = (
    url: string,
    refetch: Function
): ColDef => {
    return {
        width: 250,
        pinned: "right",
        cellRenderer: ({ data }: { data: any }) =>
            editDeleteCellRenderer(data, url, refetch),
    };
};

const editDeleteCellRenderer = (data: any, url: string, refetch: Function) => {
    const [textPayload, setTextPayload] = useState("");

    const handleEdit = async () => {
        try {
            const payload = JSON.parse(textPayload);
            axiosApi
                .patch(`${url}/${data._id}`, payload)
                .then(() => {
                    toast.success(
                        `Item: ${JSON.stringify(data)} editado com sucesso!`
                    );
                })
                .catch((err) => {
                    console.log(err);
                    toast.error(`Falha ao editar: ${JSON.stringify(data)} `);
                })
                .finally(() => {
                    refetch();
                });
        } catch (error) {
            toast.error("Payload inválido!");
        }
    };

    const handleDelete = async () => {
        axiosApi
            .delete(`${url}/${data._id}`)
            .then(() => {
                toast.success(
                    `Item: ${JSON.stringify(data)} deletado com sucesso!`
                );
            })
            .catch((err) => {
                console.log(err);
                toast.error(`Falha ao deletar: ${JSON.stringify(data)} `);
            })
            .finally(() => {
                refetch();
            });
    };

    const isEditDisabled = () => {
        try {
            JSON.parse(textPayload);
            return false;
        } catch {
            return true;
        }
    };

    useEffect(() => {
        if (data) {
            const payload = { ...data };
            delete payload._id;
            delete payload.password;
            delete payload.__v;
            delete payload.date;
            delete payload.updatedAt;

            setTextPayload(JSON.stringify(payload, null, 2));
        }
    }, [data]);

    return (
        <ButtonGroup>
            <ConfirmDialog
                icon={<BsPen />}
                openButton={{
                    label: "Editar",
                    type: "edit",
                }}
                title={"Editar Item"}
                description={"Insira o payload do arquivo"}
                extraField={
                    <Textarea
                        minH={"200px"}
                        value={textPayload}
                        onChange={(event) => setTextPayload(event.target.value)}
                    />
                }
                isConfirmDisabled={isEditDisabled()}
                saveLabel={"Editar"}
                onConfirm={handleEdit}
            />
            <ConfirmDialog
                icon={<BsTrash />}
                openButton={{
                    label: "Deletar",
                    type: "delete",
                }}
                title={"Deletar Item"}
                description={"Tem certeza que deseja deletar este item?"}
                saveLabel={"Deletar"}
                onConfirm={handleDelete}
            />
        </ButtonGroup>
    );
};
