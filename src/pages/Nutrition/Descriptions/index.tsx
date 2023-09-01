import { Card, Img, SettingCard, Table, Text } from "components";
import { Drawer } from "components/Drawer";
import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Row } from "react-table";

function Descriptions() {
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
        accessor: "provider",
      },
      {
        Header: "البروتين",
        accessor: "gender",
      },
      {
        Header: "الكاروبهيدرات",
        accessor: "mail",
      },
      {
        Header: "الدهون",
        accessor: "phone",
      },
      {
        Header: "الدهون المتحولة",
        accessor: "country",
      },
      {
        Header: "السكريات",
        accessor: "device",
      },
    ],
    []
  );
  const rowOnClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    console.log(e);
  };

  const cardData = [
    {
      label: "كيتو",
      id: 1,
    },
    {
      label: "لو كارب",
      id: 2,
    },
    {
      label: "تقليدي",
      id: 3,
    },
    {
      label: "تقليدي",
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
        modalTitle="اضافة وجبة"
        modalContent={<>dd</>}
      />
      <Drawer>ss</Drawer>
    </div>
  );
}

export default Descriptions;

export const DescriptionsLoader = async () => {
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
