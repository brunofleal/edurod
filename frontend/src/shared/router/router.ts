import { createBrowserRouter, type RouteObject } from "react-router";
import LoginPage from "../../pages/LoginPage/LoginPage";
import HomePage from "../../pages/HomePage/HomePage";
import NavbarWrapper from "../../components/NavbarWrapper/NavbarWrapper";
import OccurrencePage from "../../pages/OcurrencePage/OccurrencesPage";
import ReportsPage from "../../pages/ReportsPage/ReportsPage";
import AdminPage from "../../pages/AdminPage/AdminPage";
import RegisterPage from "../../pages/RegisterPage/RegisterPage";
import NoAccessPermissionPage from "../../pages/NoAccessPermissionPage/NoAccessPermissionPage";
import NotFoundPage from "../../pages/NotFoundPage/NotFoundPage";
import OnboardPage from "../../pages/OnboardPage/OnboardPage";

const routes: RouteObject[] = [
    {
        path: "/login",
        Component: LoginPage,
        //loader: loadRootData, //TODO Add
    },
    {
        path: "/register",
        Component: RegisterPage,
        //loader: loadRootData, //TODO Add
    },
    {
        path: "/",
        Component: NavbarWrapper,
        children: [
            {
                path: "/",
                Component: HomePage,
            },
            {
                path: "/no-access-permission",
                Component: NoAccessPermissionPage,
            },
            {
                path: "/onboard",
                Component: OnboardPage,
            },
            {
                path: "/occurrences",
                Component: OccurrencePage,
            },
            {
                path: "/reports",
                Component: ReportsPage,
            },
            {
                path: "/admin",
                Component: AdminPage,
            },
            {
                path: "*",
                Component: NotFoundPage,
            },
        ],
    },
];

export const router = createBrowserRouter(routes);
