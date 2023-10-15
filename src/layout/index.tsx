import { Outlet, useLocation, useNavigate } from "react-router-dom";
import SidePar from "./components/SIdeBar";
import Header from "./components/Header";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "hooks/useRedux";
import { selectCurrentToken, setCredentials } from "redux/slices/auth";
import { useEffect } from "react";
import { Button, Text } from "components";

function Layout() {
  const dispatch = useAppDispatch();
  const push = useNavigate();

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const token: string | any = useAppSelector(selectCurrentToken);

  const onGoBack = () => navigate(-1);

  useEffect(() => {
    const userLocalStorage = localStorage.getItem("userLogin");

    const userParse =
      userLocalStorage !== null
        ? JSON.parse(userLocalStorage ?? "")
        : { token: null, user: null };

    dispatch(setCredentials(userParse));

    axios.defaults.headers.common.Authorization = `Bearer ${
      userParse?.token as string
    }`;
    // redirect to Home
    if (userParse?.token === null || userParse?.token === undefined) {
      void push("/");
    }
  }, [pathname, token]);

  if (token === null || token === undefined) {
    return <div>loading...</div>;
  }

  return (
    <div className="flex flex-col h-full relative">
      <Header />
      <div className="font-roboto h-full grid grid-cols-11 pt-10">
        <div className="col-span-2 bg-gray-900_01">
          <SidePar />
        </div>
        <div className="p-8 col-span-9 h-full bg-gray-900_01">
          <div className="flex justify-end mb-10">
            <Button
              primary
              className={"flex items-center gap-2"}
              onClick={onGoBack}
            >
              <Text>عودة</Text>
              <img src="/images/back.svg" width={25} className="mt-1" />
            </Button>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
