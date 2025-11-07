import { Routes, Route, useRoutes } from "react-router-dom";
import Dashboard from "@/Pages/Dashboard";
import TokenExpired from "@/Pages/TokenExpired";
import Layout from "@/Pages/Layout";
import NotFoundPage from "@/Pages/NotFoundPage";

export default function AppRoutes() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        {
          path: "*",
          element: <NotFoundPage />, //Vista 404
        },
      ],
    },
    {
      path: "/tokenExpired",
      element: <TokenExpired />, //Vista Token
    },
  ]);

  return routes;
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/tokenExpired" element={<TokenExpired />} />
    </Routes>
  );
}
