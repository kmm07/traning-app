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

  const url = "/users";

  const { data: users = [], isLoading }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) => data.data,
    }
  );

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
                  {row.original.chat_badge}
                </span>
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

  const axios = useAxios({});

  const rowOnClick = async (e: any) => {
    try {
      const { data } = await axios.get(`/users/${e.original.id as any}`);

      setActiveUser(data.data);
    } catch (error: any) {
      toast.error(`${error.response.data.message}`);
    }
  };

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="w-full">
      <Table
        data={users?.users ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
      />

      <Drawer>
        <MessagesSideBAr userData={activeUser} />
      </Drawer>
    </div>
  );
}

export default Messages;
