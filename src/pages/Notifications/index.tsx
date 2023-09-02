import { SettingCard, Table } from "components";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import AddExercise from "./components/AddExercise";

function Notifications() {
  const [active, setActive] = useState(1);
  const data = useLoaderData() as {
    table: [];
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "الاسم",
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
        Header: "التاريخ",
        accessor: "date",
      },
    ],
    []
  );
  const rowOnClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    console.log(e);
  };

  const cardData = [
    {
      label: "الاشعارات العامه",
      id: 1,
    },
    {
      label: "الاشعارات المخصصة",
      id: 2,
    },
  ];

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {cardData.map((item, index) => (
          <SettingCard
            id={item.id}
            key={index}
            label={item.label}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}
      </div>

      <Table
        data={data.table}
        columns={columns}
        rowOnClick={rowOnClick}
        modalTitle="اضافة تمرين"
        modalContent={<AddExercise />}
      />

      <Drawer>
        <SideBar />
      </Drawer>
    </div>
  );
}

export default Notifications;

export const NotificationsLoader = async () => {
  return {
    table: [
      {
        date: "010000",
        name: "مصر",
      },
    ],
  };
};
