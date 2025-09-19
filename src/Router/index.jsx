import { Routes, Route } from "react-router-dom";
import Dashboard from "../Pages/Dashboard";
import TokenExpired from "../Pages/TokenExpired";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tokenExpired" element={<TokenExpired />} />
        </Routes>
    );
}
