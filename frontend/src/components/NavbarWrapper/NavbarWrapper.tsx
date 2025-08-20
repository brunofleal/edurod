import React from "react";
import { Box, Button, HStack } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Logo from "../Logo/Logo";
import NavLink from "../NavLink/NavLink";

const NavbarWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  //TODO: Implement
  return (
    <Box h="100vh">
      <HStack p={4} bgColor="green.400" w="100vw" gap="10" position="static">
        <Box cursor="pointer" onClick={() => navigate("/")}>
          <Logo />
        </Box>
        <NavLink to="/occurrences" label="Ocorrências" />
        <NavLink to="/reports" label="Relatórios" />
        <NavLink to="/admin" label="Administração" />
      </HStack>
      <Box>
        <Outlet></Outlet>
      </Box>
    </Box>
  );
};

export default NavbarWrapper;
