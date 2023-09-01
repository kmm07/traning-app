import { Outlet } from "react-router-dom";
import SidePar from "./components/SIdeBar";
import Header from "./components/Header";

function Layout() {
  return (
    <div className="flex flex-col h-full relative">
      <Header />
      <div className="font-roboto h-full grid grid-cols-11">
        <div className="col-span-2 bg-gray-900_01">
          <SidePar />
        </div>
        <div className="p-8 col-span-9 h-full bg-gray-900_01">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
