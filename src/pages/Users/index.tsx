import { Card, Select, SubState, Table, Text } from "components";
import React from "react";
import { useLoaderData } from "react-router-dom";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import UsersSideBar from "./components/UsersSideBar";
import { useAppSelector } from "hooks/useRedux";
import { selectCurrentToken } from "redux/slices/auth";

function Users() {
  const access_token: string | null | undefined =
    useAppSelector(selectCurrentToken);

  console.log({ token: access_token });

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
  const options = [{ value: "all", label: "الكل" }];
  const rowOnClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    console.log(e);
  };

  const cardData = [
    {
      count: "٣٠٠٠",
      label: "الكل",
    },
    {
      count: "٢٠٠٠",
      label: "المشتركين",
    },
    {
      count: "٥٠",
      label: "الغاء الاشتراك",
    },
    {
      count: "١٠",
      label: "الخطة المجانية",
    },
    {
      count: "١٠",
      label: "خذف التطبيق",
    },
    {
      count: "١٠",
      label: "تجديد الاشتراك",
    },
    {
      count: "١٠ ",
      label: " متوسط استخدام التطبيق بالدقائق",
    },
  ];
  return (
    <div className="w-full space-y-4">
      <div className="flex gap-3 h-24 ">
        {cardData.map((item, index) => {
          return (
            <Card key={index} className="p-4">
              <div className="flex flex-col  justify-between">
                <Text size="3xl" className=" font-bold">
                  {item.count}
                </Text>
                <Text size="3xl" className="text-gray-500 text-sm">
                  {item.label}
                </Text>
              </div>
            </Card>
          );
        })}
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
        data={[]}
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

export const usersLoader = async () => {
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

export default Users;
