import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../../contexts/AppContext";

export const useHasRequiredRole = (roles: string[]) => {
    const { userInfo } = useAppContext();

    const hasRole = () => {
        for (const role of roles) {
            if (role && userInfo && userInfo.roles.includes(role)) {
                return true;
            }
        }
        return false;
    };

    return hasRole;
};

const useRequireRoleAndRedirect = (roles: string[], rerouteTo: string) => {
    const navigate = useNavigate();
    const { userInfo } = useAppContext();
    const hasRole = useHasRequiredRole(roles);

    useEffect(() => {
        if (!hasRole() && userInfo) {
            navigate(rerouteTo);
        }
    }, [roles, userInfo]);
};

export default useRequireRoleAndRedirect;
