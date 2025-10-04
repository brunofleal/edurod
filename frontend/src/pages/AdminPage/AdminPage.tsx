import { Box, Tabs, VStack } from "@chakra-ui/react";
import React from "react";
import AgGrid from "../../components/AgGrid/AgGrid";
import useRequireRoleAndRedirect from "../../shared/requireRole";

const AdminPage = () => {
    useRequireRoleAndRedirect(["admin"], "/no-access-permission");
    return (
        <Box p={4}>
            <VStack>
                <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
                    <Tabs.List>
                        <Tabs.Trigger value="tab-1">Ocorrências</Tabs.Trigger>
                        <Tabs.Trigger value="tab-2">Motoristas</Tabs.Trigger>
                        <Tabs.Trigger value="tab-3">Linhas</Tabs.Trigger>
                        <Tabs.Trigger value="tab-4">Pontuação</Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="tab-1">
                        <AgGrid />
                    </Tabs.Content>
                    <Tabs.Content value="tab-2">
                        <AgGrid />
                    </Tabs.Content>
                    <Tabs.Content value="tab-3">
                        <AgGrid />
                    </Tabs.Content>
                    <Tabs.Content value="tab-4">
                        <AgGrid />
                    </Tabs.Content>
                </Tabs.Root>
            </VStack>
        </Box>
    );
};

export default AdminPage;
