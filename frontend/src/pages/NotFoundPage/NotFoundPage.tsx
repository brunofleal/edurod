import { Alert, Box } from "@chakra-ui/react";
import React from "react";

const NotFoundPage = () => {
    return (
        <Box>
            <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Title>Página não encontrada</Alert.Title>
            </Alert.Root>
        </Box>
    );
};

export default NotFoundPage;
