import { Card, Select, SubState, Table, Text } from "components";
import React, { useState } from "react";
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
        Cell: ({ row }: { row: Row<UserType> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <span className="indicator-item badge-sm h-6 rounded-full badge badge-warning">
                  2
                </span>
                <div className="w-12 h-12 rounded-full">
                  <img src="/images/img_rectangle347.png" />
                </div>
              </div>
              {row.original.name}
            </div>
          );
        },
      },
      {
        Header: "بريد إلكتروني",
        accessor: "mail",
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

  const options = [{ value: "all", label: "الكل" }];

  // on view user data ============================>
  const axios = useAxios({});

  const rowOnClick = async (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
  ) => {
    try {
      const { data } = await axios.get(`/users/${e.original.id}`);

      console.log(data.data);
    } catch (error: any) {
      toast.error(`${error.response.data.message}`);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {Object.entries(users?.cards ?? {})?.map(
          (item: UserType, index: number) => {
            return (
              <Card key={index} className="p-4">
                <div className="flex flex-col  justify-between">
                  <Text size="3xl" className=" font-bold capitalize">
                    {item[1]}
                  </Text>
                  <Text size="3xl" className="text-gray-500 text-sm">
                    {item[0]}
                  </Text>
                </div>
              </Card>
            );
          }
        )}
      </div>

      <Select
        isForm={false}
        options={options}
        placeholder="الكل"
        className="!w-48"
        onChange={(e) => {
          console.log(e);
        }}
      />
      <Table
        data={users.users ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
        title="جميع المستخدمين"
        modalTitle="اضافة مستخدم"
      />

      <Drawer>
        <UsersSideBar />
      </Drawer>
    </div>
  );
}

export default Users;
