import { SubState, Table } from "components";
import React, { useState } from "react";
import MessagesSideBAr from "./components/SideBar";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";
import useAxios from "hooks/useAxios";

function Messages() {
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
        Cell: ({ row }: { row: Row<any> }) => {
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
        Cell: ({ row }: { row: Row<any> }) => {
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
    <div className="w-full">
      <Table
        data={users.users ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
      />

      <Drawer>
        <MessagesSideBAr />
      </Drawer>
    </div>
  );
}

export default Messages;
