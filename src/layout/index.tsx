import { Outlet } from "react-router-dom";
import SidePar from "./components/SIdeBar";
import Header from "./components/Header";

function Layout() {
  return (
    <div className="bg-[#121220] flex flex-col h-full relative">
      <Header />
      <div className="bg-white-A700 font-roboto h-full grid grid-cols-8 w-full ">
        <div className="col-span-1">
          <SidePar />
        </div>
        <div className="p-8 col-span-7">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
