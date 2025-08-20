import { createBrowserRouter, type RouteObject } from "react-router";
import LoginPage from "../../pages/LoginPage/LoginPage";
import HomePage from "../../pages/HomePage/HomePage";
import NavbarWrapper from "../../components/NavbarWrapper/NavbarWrapper";
import OccurrencePage from "../../pages/OcurrencePage/OccurrencesPage";
import ReportsPage from "../../pages/ReportsPage/ReportsPage";
import AdminPage from "../../pages/AdminPage/AdminPage";

const routes: RouteObject[] = [
  {
    path: "/login",
    Component: LoginPage,
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
        path: "/occurrences",
        Component: OccurrencePage,
      },
      {
        path: "/reports",
        Component: ReportsPage,
      },
      {
        path: "/reports",
        Component: AdminPage,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
