import { Outlet } from "react-router-dom";
import SidePar from "./components/SIdeBar";
import Header from "./components/Header";

function Layout() {
  return (
    <div className="bg-[#121220] flex flex-col h-full relative">
      <Header />
      <div className="bg-white-A700 font-roboto h-full grid grid-cols-11 w-full ">
        <div className="col-span-2">
          <SidePar />
        </div>
        <div className="p-8 col-span-9">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
