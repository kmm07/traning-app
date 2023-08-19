import { Card, Img, Modal, Table, Text } from "components";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";

function Ingredients() {
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
        Header: " السعرات",
        accessor: "mail",
      },
      {
        Header: "الكاربوهيدات",
        accessor: "gender", // accessor is the "key" in the data
      },
      {
        Header: "البروتين",
        accessor: "gender",
      },
      {
        Header: "الدهون",
        accessor: "phone",
      },
      {
        Header: "السكريات",
        accessor: "country",
      },
      {
        Header: "الدهون التحولة",
        accessor: "device",
      },
      {
        Header: "القياس",
        accessor: "lastSeen",
      },
      {
        Header: "الحجم",
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
      label: "الكل",
      id: 1,
    },
    {
      label: "خضار",
      id: 2,
    },
    {
      label: "اسماك",
      id: 3,
    },
    {
      label: "حبوب",
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
        <Card className={`p-4 w-[180px] cursor-pointer `}>
          <label
            htmlFor="add-new-nutrition"
            className={`flex flex-col justify-between items-center relative `}
          >
            <Img
              className="w-16 absolute top-0 left-0"
              src="/images/plus.svg"
            />
            <Text size="3xl" className="mt-4">
              اضافة
            </Text>
          </label>
        </Card>
      </div>

      <Table
        data={data.table}
        columns={columns}
        rowOnClick={rowOnClick}
        modalTitle="اضافة مكون"
      />
      <Modal id="add-new-nutrition">add-new-nutrition</Modal>
      <Drawer>ss</Drawer>
    </div>
  );
}

export default Ingredients;

export const IngredientsLoader = async () => {
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
