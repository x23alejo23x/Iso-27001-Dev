import { urlIceberg } from "@/Server";
import logo from "@/assets/svg/Logo_Dashboard.svg";

const Header = () => {
  const homeIceberg = () => {
    window.location.href = `${urlIceberg}`;
  };

  return (
    <header className="w-full h-[60px] bg-black text-white flex items-center justify-between px-4 md:px-7">
      <div className="flex items-center gap-2 text-gray-300">
        <img
          src={logo}
          alt="Logo"
          className="h-[35px] object-contain cursor-pointer"
          onClick={homeIceberg}
        />
        <p className="text-xl md:text-2xl leading-none text-neutral-300 font-semibold ">|</p>
        <p className="text-lg md:text-xl font-semibold leading-none text-stone-100 ml-1 uppercase">
          {import.meta.env.VITE_APP_NAME}
        </p>
      </div>
    </header >
  );
};

export default Header;
