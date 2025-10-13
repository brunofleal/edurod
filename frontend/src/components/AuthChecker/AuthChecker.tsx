import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { getToken } from "../../shared/token";

const AuthChecker = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const checkAuth = () => {
        const token = getToken();
        if (!token) {
            navigate("/login");
        }
    };

    useEffect(() => {
        checkAuth();
    }, [location]);

    return <></>;
};

export default AuthChecker;
