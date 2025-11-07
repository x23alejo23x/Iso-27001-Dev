import { useEffect, useRef } from "react";

const Header = () => {
  const headerRef = useRef(null);
  useEffect(() => {
    const header = headerRef.current;
    if (header) {
      const updateModuleName = () => {
        const newName = import.meta.env.VITE_APP_NAME;
        header.setAttribute("moduleName", newName);
      };
      updateModuleName();
    }
  }, []);

  return <mi-header ref={headerRef}></mi-header>;
};
export default Header;
