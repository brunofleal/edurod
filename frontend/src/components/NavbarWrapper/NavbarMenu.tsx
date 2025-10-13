import { Button, Menu, Portal } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { BsGearFill } from "react-icons/bs";
import { useAppContext } from "../../contexts/AppContext";

const NavBarMenu = () => {
    const navigate = useNavigate();
    const { logout } = useAppContext();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Button variant="subtle" size="sm">
                    <BsGearFill />
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
