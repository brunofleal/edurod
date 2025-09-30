import React, { useEffect, useState } from "react";
import { Box, Button, Center, Input, Stack } from "@chakra-ui/react";
import Logo from "../../components/Logo/Logo";
import { axiosApi } from "../../shared/axiosApi";
import { toast, ToastContainer } from "react-toastify";
import { getToken, setToken } from "../../shared/token";
import { useNavigate } from "react-router";

const LoginPage = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (getToken()) {
            navigate("/");
        }
    }, []);

    const handleLogin = () => {
        axiosApi
            .post("/api/user/login", { email, password })
            .then((response) => {
                console.log({ response });
                if (response && response.status) {
                    toast.success("Usuário logado com sucesso!", {
                        position: "top-center",
                        autoClose: 15000,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                    });
                    const token = response.data;
                    setToken(token);
                    navigate("/");
                } else {
                    toast.error("Falha no Login. Email ou senha incorreto", {
                        position: "top-center",
                        autoClose: 15000,
                        closeOnClick: false,
                        pauseOnHover: true,
                        draggable: true,
                        theme: "light",
                    });
                }
            })
            .catch(() => {
                toast.error("Falha no Login. Email ou senha incorreto", {
                    position: "top-center",
                    autoClose: 15000,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "light",
                });
            });
    };

    return (
        <Box h="100vh" w="100vw">
            <ToastContainer />
            <Center
                h="100vh"
                w="100vw"
                bgGradient="to-br"
                gradientFrom="red.400"
                gradientTo="green.400"
            >
                <Stack
                    bgColor="gray.200"
                    p={8}
                    gap="4"
                    boxShadow="3xl"
                    borderRadius="10%"
                >
                    <Logo />
                    <Input
                        placeholder="Email"
                        variant="subtle"
                        type="email"
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <Input
                        placeholder="Senha"
                        variant="subtle"
                        type="password"
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <Button
                        disabled={!(email && password)}
                        onClick={handleLogin}
                    >
                        Login
                    </Button>
                </Stack>
            </Center>
        </Box>
    );
};

export default LoginPage;
