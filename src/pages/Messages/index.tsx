import { SubState, Table } from "components";
import React from "react";
import { useLoaderData } from "react-router-dom";
import MessagesSideBAr from "./components/SideBar";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";

function Messages() {
  const data = useLoaderData() as {
    table: [];
  };

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
                  <img src="images/img_rectangle347.png" />
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
        Header: "جنس",
        accessor: "gender", // accessor is the "key" in the data
      },
      {
        Header: "الخطة",
        Cell: ({ row }: { row: Row<any> }) => {
          return <SubState state={row.original.subscribe.type} />;
        },
      },
    ],
    []
  );
  const rowOnClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    console.log(e);
  };
  return (
    <div className="w-full">
      <Table
        data={data.table}
        columns={columns}
        rowOnClick={rowOnClick}
        title="جميع المستخدمين"
        modalTitle="اضافة مستخدم"
      />

      <Drawer>
        <MessagesSideBAr />
      </Drawer>
    </div>
  );
}

export const messagesLoader = async () => {
  return {
    table: [
      {
        name: "Tanner Linsley",
        mail: "example@gmail.com",
        gender: "ذكر",
        subscribe: {
          type: "free",
          age: "شهر",
        },
      },
    ],
  };
};

export default Messages;
