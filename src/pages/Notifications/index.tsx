import {  Card, Img, Modal, SettingCard, Table, Text } from "components";
import React, { useState } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { UseQueryResult } from "react-query";
import { useGetQuery } from "hooks/useQueryHooks";
import AddNotification from "./components/AddNotification";

function Notifications() {
  const [active, setActive] = useState(1);

  // get notifications data =================>
  const url = "/notifications";

  const { data }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

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

        <Card className={"p-4 w-[180px]"}>
          <label
            htmlFor="add-notification"
            className={
              "flex flex-col cursor-pointer justify-between items-center relative"
            }
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
      <Table data={data ?? []} columns={columns} rowOnClick={rowOnClick} />

      <Drawer>
        <SideBar />
      </Drawer>

      <Modal id="add-notification">
        <AddNotification />
      </Modal>
    </div>
  );
}

export default Notifications;
