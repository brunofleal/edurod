import { createBrowserRouter, type RouteObject } from "react-router";
import LoginPage from "../../pages/LoginPage/LoginPage";
import HomePage from "../../pages/HomePage/HomePage";
import NavbarWrapper from "../../components/NavbarWrapper/NavbarWrapper";


const routes: RouteObject[] = [
    {
        path: "/login",
        Component: LoginPage,
        //loader: loadRootData, //TODO Add
    },
    {
        path: "/", 
        Component: NavbarWrapper,
        children:[
            {
                path: "/",
                Component: HomePage
            },
        ]
    }
]

export const router = createBrowserRouter(routes);
