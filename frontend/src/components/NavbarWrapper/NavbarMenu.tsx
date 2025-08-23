import { Button, Menu, Portal } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router";

const NavBarMenu = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    //TODO: Implement
    navigate("/login");
  };

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="subtle" size="sm">
          Opções
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="new-txt-a">
              <Button variant="subtle" onClick={handleLogout}>
                Logout
              </Button>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
};

export default NavBarMenu;
