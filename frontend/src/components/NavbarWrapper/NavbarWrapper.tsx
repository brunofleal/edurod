import React from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router";

const NavbarWrapper = () => {
    //TODO: Implement 
    return <Box>
        <Box>NavBar</Box>
        <Box>
            <Outlet></Outlet>
        </Box>
    </Box>
}

export default NavbarWrapper;