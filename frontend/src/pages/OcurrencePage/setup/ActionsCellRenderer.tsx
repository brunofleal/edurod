import type { CustomCellRendererProps } from "ag-grid-react";
import type { OccurrenceRegistry } from "../../../interfaces/occurrenceRegistry";
import { ButtonGroup, Icon, Textarea, Field } from "@chakra-ui/react";
import { BsArchive, BsTrash } from "react-icons/bs";
import { ConfirmDialog } from "../../../components/ConfirmDialog/ConfirmDialog";
import { useState } from "react";
import { axiosApi } from "../../../shared/axiosApi";
import { useHasRequiredRole } from "../../../shared/hooks/requireRole";
import { Role } from "../../../interfaces/roles";
import { toast } from "react-toastify";
import { useOccurrenceContext } from "../OccurrenceContext";
import NewOccurrenceModal from "../NewOccurrenceModal/NewOccurrenceModal";

const ActionsCellRenderer = ({
    data,
}: CustomCellRendererProps<OccurrenceRegistry>) => {
    const { refetch } = useOccurrenceContext();
    const [closingCommentary, setClosingCommentary] = useState("");

    const canViewClose = useHasRequiredRole([Role.ADMIN, Role.CLOSER])();
    const canViewEdit = useHasRequiredRole([Role.ADMIN, Role.OPENER])();
    const canViewDelete = useHasRequiredRole([Role.ADMIN, Role.OPENER])();

    const handleCloseOccurrence = () => {
        if (!data) {
            console.error("no data");
            return;
        }
        const payload = {
            isResolved: true,
            resolvedDate: Date.now(),
            closingCommentary,
        };
        axiosApi
            .patch(`/api/occurrences/${data._id}`, payload)
            .then((response) => {
                if (response.data.err) {
                    toast.error("Falha ao fechar ocorrência.");
                } else {
                    toast.success("Ocorrência fechada com sucesso");
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Falha ao fechar ocorrência.");
            })
            .finally(() => {
                refetch();
            });
    };
    const handleDeleteOccurrence = () => {
        if (!data) {
            console.error("no data");
            return;
        }
        axiosApi
            .delete(`/api/occurrences/${data._id}`)
            .then((response) => {
                if (response.data.err) {
                    toast.error("Falha ao deletar ocorrência");
                } else {
                    toast.success("Ocorrência deletada com sucesso");
                }
            })
            .catch((error) => {
                console.error(error);
                toast.error("Falha ao deletar ocorrência");
            })
            .finally(() => {
                refetch();
            });
    };
    return (
        <ButtonGroup>
            <ConfirmDialog
                openButton={{
                    label: "Fechar",
                    type: "edit",
                }}
                title={"Fechar Ocorrência"}
                description={"Tem certeza que deseja fechar essa ocorrência?"}
                saveLabel={"Confirmar"}
                onConfirm={handleCloseOccurrence}
                isConfirmDisabled={closingCommentary.length < 3}
                isHidden={!canViewClose || data?.isResolved}
                extraField={
                    <Field.Root>
                        <Field.Label>Detalhamento ocorrência</Field.Label>
                        <Textarea
                            placeholder="Descreva a ação tomada para encerramento da ocorrência"
                            onChange={(e) =>
                                setClosingCommentary(e.target.value)
                            }
                        />
                    </Field.Root>
                }
                icon={
                    <Icon mr={2}>
                        <BsArchive />
                    </Icon>
                }
            />
            {canViewEdit ? (
                <NewOccurrenceModal mode="edit" editData={data} />
            ) : (
                <></>
            )}

            <ConfirmDialog
                openButton={{
                    label: "Deletar",
                    type: "delete",
                }}
                title={"Deletar Ocorrência"}
                description={
                    "Tem certeza que deseja deletar essa ocorrência? Essa operação não pode ser desfeita."
                }
                saveLabel={"Deletar"}
                onConfirm={handleDeleteOccurrence}
                isConfirmDisabled={false}
                isHidden={!canViewDelete || data?.isResolved}
                icon={
                    <Icon mr={2}>
                        <BsTrash />
                    </Icon>
                }
            />
        </ButtonGroup>
    );
};

export default ActionsCellRenderer;
