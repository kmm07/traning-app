import { SettingCard, Table, Tabs } from "components";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import AddCard from "shared/AddCard";
import SideBar from "./components/SideBar";

function TableHome() {
  const [level, setLevel] = useState(1);
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
        Header: " هدف الاسبوع",
      },
    ],
    []
  );
  const rowOnClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    console.log(e);
  };

  const cardData = [
    {
      label: "مبتدئ",
      id: 1,
    },
    {
      label: "متوسط",
      id: 2,
    },
    {
      label: "متقدم",
      id: 3,
    },
  ];

  const onDelete = (id: number) => {
    console.log(id);
  };
  const onEdit = (id: number) => {
    console.log(id);
  };
  const onSave = () => {
    console.log("save");
  };
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {cardData.map((item, index) => (
          <SettingCard
            onDelete={onDelete}
            onEdit={onEdit}
            id={item.id}
            key={index}
            label={item.label}
            active={level === item.id}
            onClick={() => setLevel(item.id)}
          />
        ))}
        <AddCard
          modalContent={<>dd</>}
          onSave={onSave}
          modalLabel="اضافة مستوى"
        />
      </div>
      <Tabs
        tabs={[
          {
            name: "الاسبوع الاول",
            isActive: true,
          },
        ]}
        onClick={() => {}}
      />
      <Table
        data={data.table}
        columns={columns}
        rowOnClick={rowOnClick}
        modalTitle="اضافة اسبوع"
      />

      <Drawer>
        <SideBar />
      </Drawer>
    </div>
  );
}

export default TableHome;

export const ExercisesHomeLoader = async () => {
  return {
    table: [
      {
        phone: "01000000000",
        name: "مصر",
      },
    ],
  };
};
