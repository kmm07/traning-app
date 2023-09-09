import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SidePar from "./components/SIdeBar";
import Header from "./components/Header";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { selectCurrentToken, setCredentials } from "redux/slices/auth";
import { useEffect } from "react";

function Layout() {
  const dispatch = useAppDispatch();
  const push = useNavigate();
  const { pathname } = useLocation();
  const token: string | any = useAppSelector(selectCurrentToken);

  useEffect(() => {
    const userLocalStorage = localStorage.getItem("user");

    const userParse =
      userLocalStorage !== null
        ? JSON.parse(userLocalStorage ?? "")
        : { token: null, data: null };

    dispatch(setCredentials(userParse));
    // redirect to Home
    if (
      (userParse?.data?.token === null ||
        userParse?.data?.token === undefined) &&
      isPublic(pathname)
    ) {
      void push("/signin");
    }
  }, [pathname, token]);

  axios.defaults.headers.common.Authorization = `Bearer ${token as string}`;
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
const isPublic = (url: string) => {
  const publicRoutes = [/^\/(\?.*)?$/, /^\/signup/];

  return !publicRoutes.some((path) => path.test(url));
};
export default Layout;
