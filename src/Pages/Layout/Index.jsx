import { Outlet } from "react-router-dom";
import Header from "@/Components/Header/Index.jsx";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="flex h-[calc(100vh_-_5rem)] bg-gray-100">
        <Outlet />
      </div>
    </>
  );
};

export default Layout;
