import { Button, Img, SettingCard, SubState, Table } from "components";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";

function MenTraining() {
  const [level, setLevel] = useState(1);
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
        Header: "جنس",
        accessor: "gender", // accessor is the "key" in the data
      },
      {
        Header: "الخطة",
        Cell: ({ row }: { row: Row<any> }) => {
          return <SubState state={row.original.subscribe.type} />;
        },
      },
      {
        Header: "الهاتف",
        accessor: "phone",
      },
      {
        Header: "الدولة",
        accessor: "country",
      },
      {
        Header: "الجهاز",
        accessor: "device",
      },
      {
        Header: "آخر ظهور",
        accessor: "lastSeen",
      },
      {
        Header: "مزود الدخول",
        accessor: "provider",
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
      </div>
      <div className="flex gap-4">
        <Button secondaryBorder>يومين في الاسبوع</Button>
        <Button primary>يومين في الاسبوع</Button>
        <span className="text-indigo-500">
          <Img src="/images/plus.svg" />
          اضافة
        </span>
      </div>
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

export default MenTraining;

export const MenTrainingLoader = async () => {
  return {
    table: [
      {
        name: "Tanner Linsley",
        mail: "example@gmail.com",
        gender: "ذكر",
        phone: "01000000000",
        country: "مصر",
        device: "ios",
        lastSeen: "منذ 5 دقائق",
        provider: "google",
        subscribe: {
          type: "free",
          age: "شهر",
        },
      },
    ],
  };
};
