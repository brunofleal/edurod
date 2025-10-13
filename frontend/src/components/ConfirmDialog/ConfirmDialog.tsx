import { Button, CloseButton, Dialog, HStack, Portal } from "@chakra-ui/react";
import type { JSX } from "react";

interface Props {
    openButton: { label: string; type: "edit" | "delete" };
    title: string;
    description: string;
    saveLabel: string;
    onConfirm: Function;
    isConfirmDisabled?: boolean;
    isHidden?: boolean;
    icon?: JSX.Element;
    extraField?: JSX.Element;
}
export const ConfirmDialog = ({
    openButton,
    title,
    description,
    onConfirm,
    isConfirmDisabled,
    isHidden,
    icon,
    extraField,
}: Props) => {
    const actionButtonProps =
        openButton.type == "delete"
            ? { bgColor: "red.600", color: "white" }
            : { bgColor: "black", color: "white" };
    return (
        <Dialog.Root size="md">
            <Dialog.Trigger asChild>
                <Button
                    display={isHidden ? "none" : "block"}
                    variant="solid"
                    size={"xs"}
                    {...actionButtonProps}
                >
                    <HStack>
                        {icon} {openButton.label}
                    </HStack>
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title} </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>{description}</p>
                            {extraField}
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    {...actionButtonProps}
                                    onClick={() => onConfirm()}
                                    disabled={!!isConfirmDisabled}
                                >
                                    Confirmar
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
