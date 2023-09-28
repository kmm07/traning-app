import { Card, SubState, Table, Text } from "components";
import React, { useState, useMemo, useEffect } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import UsersSideBar from "./components/UsersSideBar";
import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import useAxios from "hooks/useAxios";
import { toast } from "react-toastify";

interface UserType {
  country: string;
  email: string;
  gender: string;
  have_subscription: boolean;
  id: number;
  last_viewed: string;
  name: string;
  phone: string;
  phone_model: string;
  provider: string;
  subscription: string;
  subscription_status: string;
}

function Users() {
  const [activeUser, setActiveUser] = useState<any>(null);

  const [activeState, setActiveState] = useState<string>("all");

  // get users list ======================>
  const url = "/users";

  const { data: users = [] }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
        accessor: "name",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={row.original.image || "/images/img_rectangle347.png"}
                  />
                </div>
              </div>
              {row.original.name}
            </div>
          );
        },
      },
      {
        Header: "بريد إلكتروني",
        accessor: "email",
      },

      {
        Header: "الهاتف",
        accessor: "phone",
      },

      {
        Header: "جنس",
        accessor: "gender", // accessor is the "key" in the data
      },
      {
        Header: "نوع الإشتراك",
        Cell: ({ row }: { row: Row<UserType> }) => {
          return <SubState state={row.original.subscription_status as any} />;
        },
      },
      {
        Header: "الدولة",
        accessor: "country",
      },
      {
        Header: "الجهاز",
        accessor: "phone_model",
      },
      {
        Header: "آخر ظهور",
        accessor: "last_viewed",
      },
      {
        Header: "مزود الدخول",
        accessor: "provider",
      },
    ],
    []
  );

  // on view user data ============================>
  const axios = useAxios({});

  const rowOnClick = async (e: any) => {
    try {
      const { data } = await axios.get(`/users/${e.original.id as any}`);
      console.log("data >>>> ", data);
      setActiveUser(data.data);
    } catch (error: any) {
      toast.error(`${error.response.data.message}`);
    }
  };

  const cardsTranslator = (name: string) => {
    switch (name) {
      case "all":
        return "جميع المستخدمين";
      case "subscriped":
        return "المشتركين";
      case "canceled":
        return "اشتراكات ملغية";
      case "free":
        return "اشتراكات مجانية";
      case "not_subscriped":
        return "غير مشتركين";
    }
  };

  // filter by category =====================>
  const onChangeCategory = (category: string) => setActiveState(category);

  const filteredUsers = useMemo(() => {
    return users?.users?.filter(
      (user: any) =>
        user?.subscription_status === activeState || activeState === "all"
    );
  }, [activeState, users]);

  // open sidebar if is coming from messages ===============>
  useEffect(() => {
    const userFromMessage = localStorage.getItem("user_id_From_messages");

    if (![null, undefined].includes(userFromMessage as any)) {
      const getUserData = async () => {
        try {
          const { data } = await axios.get(`/users/${userFromMessage as any}`);

          await setActiveUser(data.data);

          document.getElementById("my-drawer")?.click();
        } catch (error: any) {
          toast.error(`${error.response.data.message}`);
        }
      };
      getUserData();
    }

    return () => localStorage.removeItem("user_id_From_messages");
  }, []);

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {Object.entries(users?.cards ?? {})?.map((item: any, index: number) => {
          return (
            <Card
              key={index}
              className={`p-4 cursor-pointer ${
                activeState === item[0] ? "bg-light_blue-500" : ""
              }`}
              onClick={() => onChangeCategory(item[0])}
            >
              <div className="flex flex-col  justify-between">
                <Text size="3xl" className=" font-bold capitalize">
                  {item[1]}
                </Text>
                <Text size="3xl" className="text-white text-sm font-bold">
                  {cardsTranslator(item[0])}
                </Text>
              </div>
            </Card>
          );
        })}
      </div>

      <Table
        data={(filteredUsers as any) ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
        title="جميع المستخدمين"
      />

      <Drawer>
        <UsersSideBar activeUser={activeUser} />
      </Drawer>
    </div>
  );
}

export default Users;
