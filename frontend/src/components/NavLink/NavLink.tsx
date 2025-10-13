import { Button } from "@chakra-ui/react";

import { useLocation, useNavigate } from "react-router";

interface Props {
    to: string;
    label: string;
}
const NavLink = ({ to, label }: Props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isInCurrentPath = location.pathname.includes(to);
    return (
        <Button
            variant={isInCurrentPath ? "solid" : "subtle"}
            fontWeight="bold"
            onClick={() => navigate(to)}
        >
            {label}
        </Button>
    );
};

export default NavLink;
