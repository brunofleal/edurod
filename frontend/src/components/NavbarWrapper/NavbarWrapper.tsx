import React from "react";
import { Avatar, Box, HStack } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Logo from "../Logo/Logo";
import NavLink from "../NavLink/NavLink";
import NavbarMenu from "./NavbarMenu";

const NavbarWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //TODO: Implement
  return (
    <Box h="100vh">
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
          <Avatar.Root>
            <Avatar.Image src="https://bit.ly/broken-link" />
            <Avatar.Fallback />
          </Avatar.Root>
          <NavbarMenu />
        </HStack>
      </HStack>
      <Box>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
};

export default NavbarWrapper;
