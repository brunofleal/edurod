import { Alert, Box } from "@chakra-ui/react";
import React from "react";

const NoAccessPermissionPage = () => {
    return (
        <Box>
            <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>
                    Você não tem permissão para acessar essa página
                </Alert.Title>
            </Alert.Root>
        </Box>
    );
};

export default NoAccessPermissionPage;
