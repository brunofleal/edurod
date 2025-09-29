"use client";
import React, { useState } from "react";
import { Box, Button, Center, Input, Stack, Text } from "@chakra-ui/react";
import { axiosApi } from "../../shared/axiosApi";
import { toast, ToastContainer } from "react-toastify";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleRegister = () => {
    axiosApi
      .post("/api/user/register", { name, email, password })
      .then((response) => {
        if (response && response.status) {
          toast.success("usuário criado com sucesso ", {
            position: "top-center",
            autoClose: 15000,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
          });
        } else {
          toast.error("Falha na criação do usuário", {
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
        toast.error("Falha na criação do usuário", {
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
        gradientFrom="green.600"
        gradientTo="red.600"
      >
        <Stack
          bgColor="gray.200"
          p={8}
          gap="4"
          boxShadow="3xl"
          borderRadius="10%"
        >
          <Text fontWeight="bold" fontSize="2xl">
            Registro
          </Text>
          <Input
            placeholder="Email"
            variant="subtle"
            type="email"
            onChange={(event) => setEmail(event.target.value)}
          />
          <Input
            placeholder="Nome"
            variant="subtle"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
          <Input
            placeholder="Senha"
            variant="subtle"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button
            disabled={!(email && password && name)}
            onClick={handleRegister}
          >
            Login
          </Button>
        </Stack>
      </Center>
    </Box>
  );
};

export default RegisterPage;
