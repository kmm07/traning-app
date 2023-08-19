import { Card, Img, SubState, Table, Text } from "components";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";

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
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {cardData.map((item, index) => {
          return (
            <Card
              key={index}
              className={`p-4 w-[180px] cursor-pointer ${
                level === item.id && "bg-[#00A4FA]"
              }`}
            >
              <div
                onClick={() => setLevel(item.id)}
                className={`flex flex-col justify-between items-center relative `}
              >
                <Img
                  className="w-4 absolute top-0 left-0"
                  src="/images/img_customize2.png"
                />
                <Text size="3xl" className="mt-4">
                  {item.label}
                </Text>
              </div>
            </Card>
          );
        })}
      </div>

      <Table
        data={data.table}
        columns={columns}
        rowOnClick={rowOnClick}
        modalTitle="اضافة اسبوع"
      />

      <Drawer>ss</Drawer>
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
