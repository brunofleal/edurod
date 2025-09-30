import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { deleteToken, getToken } from "../shared/token";
import type { UserInfo } from "../shared/models/user";

interface AppContextType {
    isAuthenticated: boolean;
    userInfo: UserInfo;
    login: (userData: any) => void;
    logout: () => void;
    setUserInfo: (userData: UserInfo) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<any>(null);

    useEffect(() => {
        const token = getToken();
        if (token) {
            setIsAuthenticated(true);
            // You can decode token or fetch user data here
        }
    }, []);

    const login = (userData: any) => {
        setIsAuthenticated(true);
        setUserInfo(userData);
    };

    const logout = () => {
        deleteToken();
        setIsAuthenticated(false);
        setUserInfo(null);
    };

    const value: AppContextType = {
        isAuthenticated,
        userInfo,
        login,
        logout,
        setUserInfo,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
