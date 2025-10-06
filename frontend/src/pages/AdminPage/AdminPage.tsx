import { Box, Tabs, VStack } from "@chakra-ui/react";
import React from "react";
import useRequireRoleAndRedirect from "../../shared/hooks/requireRole";
import PanelGrid from "./PanelGrid";

const AdminPage = () => {
    useRequireRoleAndRedirect(["admin"], "/no-access-permission");

    return (
        <Box p={4}>
            <VStack>
                <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
                    <Tabs.List>
                        <Tabs.Trigger value="tab-1">Usuários</Tabs.Trigger>
                        <Tabs.Trigger value="tab-2">Motoristas</Tabs.Trigger>
                        <Tabs.Trigger value="tab-3">Linhas</Tabs.Trigger>
                        <Tabs.Trigger value="tab-4">
                            Tipo de Ocorrências
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="tab-1">
                        <PanelGrid url="/api/user" />
                    </Tabs.Content>
                    <Tabs.Content value="tab-2">
                        <PanelGrid url="/api/drivers" />
                    </Tabs.Content>
                    <Tabs.Content value="tab-3">
                        <PanelGrid url="/api/lines" />
                    </Tabs.Content>
                    <Tabs.Content value="tab-4">
                        <PanelGrid url="/api/occurrenceTypes" />
                    </Tabs.Content>
                </Tabs.Root>
            </VStack>
        </Box>
    );
};

export default AdminPage;
