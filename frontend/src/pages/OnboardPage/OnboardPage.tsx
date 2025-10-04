import { Box, Alert } from "@chakra-ui/react";

const OnboardPage = () => {
    return (
        <Box>
            <Alert.Root status="success">
                <Alert.Indicator />
                <Alert.Title>
                    Sua conta no Edurod foi criada com sucesso!
                </Alert.Title>
            </Alert.Root>
            <Alert.Root status="info">
                <Alert.Indicator />
                <Alert.Title>
                    Contate um administrador e peça para adicionar permissões de
                    acesso.
                </Alert.Title>
            </Alert.Root>
        </Box>
    );
};

export default OnboardPage;
