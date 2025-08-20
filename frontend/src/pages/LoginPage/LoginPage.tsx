import React, { useState } from "react";
import { Box, Button, Center, Input, Stack } from "@chakra-ui/react";
import Logo from "../../components/Logo/Logo";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return <Box  h='100vh' w='100vw'>
        <Center 
            h='100vh' w='100vw'
            bgGradient='to-br' 
            gradientFrom='red.400' 
            gradientTo='green.400'
        >
            <Stack bgColor='gray.200' p={8} gap="4" boxShadow='3xl' borderRadius='10%'>
                <Logo />
                <Input placeholder="Login" variant="subtle" type="text" onChange={(event)=>setUsername(event.target.value)} />
                <Input placeholder="Senha" variant="subtle" type='password' onChange={(event)=>setPassword(event.target.value)} />
                <Button disabled={!(username && password)}>
                    Login
                </Button>
            </Stack>
        </Center>
    </Box>  
}

export default LoginPage;