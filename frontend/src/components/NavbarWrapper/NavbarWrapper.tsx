import React, { useEffect, useState } from "react";
import { Avatar, Box, HStack, Text } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router";
import Logo from "../Logo/Logo";
import NavLink from "../NavLink/NavLink";
import NavbarMenu from "./NavbarMenu";
import AuthChecker from "../AuthChecker/AuthChecker";
import { axiosApi } from "../../shared/axiosApi";
import { capitalizeName } from "../../shared/utils/stringUtils";
import { AppProvider, useAppContext } from "../../contexts/AppContext";

const NavbarContent = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppContext();

    useEffect(() => {
        //Retrieve user info
        axiosApi.get("/api/user/me").then((response) => {
            if (response) {
                const userData = response.data;
                setUserInfo(userData);
            }
        });
    }, []);

    return (
        <Box h="100vh">
            <AuthChecker />
            <HStack
                p={6}
                bgColor="gray.600"
                w="100vw"
                position="static"
                justifyContent="space-between"
            >
                <HStack gap={20}>
                    <Box cursor="pointer" onClick={() => navigate("/")}>
                        <Logo />
                    </Box>
                    <NavLink to="/occurrences" label="Ocorrências" />
                    <NavLink to="/reports" label="Relatórios" />
                    <NavLink to="/admin" label="Administração" />
                </HStack>
                <HStack justifySelf="flex-end" gap={4}>
                    <HStack bgColor="white" borderRadius="md" p={1}>
                        <Avatar.Root>
                            <Avatar.Image src="https://bit.ly/broken-link" />
                            <Avatar.Fallback />
                        </Avatar.Root>
                        <Text>
                            {userInfo ? capitalizeName(userInfo.name) : ""}
                        </Text>
                    </HStack>

                    <NavbarMenu />
                </HStack>
            </HStack>
            <Box>
                <Outlet></Outlet>
            </Box>
        </Box>
    );
};

const NavbarWrapper = () => {
    return (
        <AppProvider>
            <NavbarContent />
        </AppProvider>
    );
};

export default NavbarWrapper;
