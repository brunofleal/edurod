import { Badge, Box, Flex, Tabs, VStack } from "@chakra-ui/react";
import React from "react";
import useRequireRoleAndRedirect from "../../shared/hooks/requireRole";
import PanelGrid from "./PanelGrid";
import { Role } from "../../interfaces/roles";
import SystemVariablesPanel from "./SystemVariablesPanel";
import CategoryGrid from "./CategoryGrid/CategoryGrid";

const AdminPage = () => {
    useRequireRoleAndRedirect([Role.ADMIN], "/no-access-permission");

    return (
        <Box p={4} w="100vw">
            <VStack>
                <Tabs.Root lazyMount unmountOnExit defaultValue="tab-1">
                    <Tabs.List>
                        <Tabs.Trigger value="tab-1">Usuários</Tabs.Trigger>
                        <Tabs.Trigger value="tab-2">Motoristas</Tabs.Trigger>
                        <Tabs.Trigger value="tab-3">Linhas</Tabs.Trigger>
                        <Tabs.Trigger value="tab-4">Veículos</Tabs.Trigger>
                        <Tabs.Trigger value="tab-5">
                            Tipo de Ocorrências
                        </Tabs.Trigger>
                        <Tabs.Trigger value="tab-6">
                            Categoria de Ocorrência
                        </Tabs.Trigger>
                        <Tabs.Trigger value="tab-7">Log de Ações</Tabs.Trigger>
                        <Tabs.Trigger value="tab-8">
                            Variáveis de Sistema
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="tab-1">
                        <p>Roles disponíveis:</p>
                        <Flex gap={2}>
                            {Object.values(Role).map((role) => (
                                <Badge key={role}>{role}</Badge>
                            ))}
                        </Flex>
                        <PanelGrid
                            url="/api/user"
                            attributes={["name", "email", "password", "roles"]}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="tab-2">
                        <PanelGrid
                            url="/api/drivers"
                            attributes={["matricula", "name"]}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="tab-3">
                        <PanelGrid
                            url="/api/lines"
                            attributes={["code", "description"]}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="tab-4">
                        <PanelGrid
                            url="/api/vehicles"
                            attributes={["code", "plate", "nChassi", "date"]}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="tab-5">
                        <CategoryGrid />
                    </Tabs.Content>
                    <Tabs.Content value="tab-6">
                        <PanelGrid
                            url="/api/occurrenceCategories"
                            attributes={["name", "points"]}
                        />
                    </Tabs.Content>
                    <Tabs.Content value="tab-7">
                        <PanelGrid url="/api/logActions" noActions={true} />
                    </Tabs.Content>
                    <Tabs.Content value="tab-8">
                        <SystemVariablesPanel />
                    </Tabs.Content>
                </Tabs.Root>
            </VStack>
        </Box>
    );
};

export default AdminPage;
