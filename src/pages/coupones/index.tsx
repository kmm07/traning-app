import { Card, Img, Modal, SettingCard, Table, Text } from "components";
import { useGetQuery } from "hooks/useQueryHooks";
// import AddNotification from "pages/Notifications/components/AddNotification";
import React, { useState } from "react";
import { UseQueryResult } from "react-query";
import { Row } from "react-table";
import AddCoupone from "./components/add-coupone";
import { Drawer } from "components/Drawer";
import CouponeSideBar from "./components/sideBar";

type Props = {};

export default function Coupones({}: Props) {
  const [active, setActive] = useState<number>();

  // get notifications data =================>
  const url = "/coupons";

  const { data = [] }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

  const cardData = [
    {
      label: "الكوبونات",
      id: 1,
    },
    {
      label: "طلبات الكوبونات",
      id: 2,
    },
  ];

  const columns = React.useMemo(
    () => [
      {
        Header: "اليوم",
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
              اليوم رقم {row.original?.day_num}
            </div>
          );
        },
      },
      {
        Header: "id",
        accessor: "day_num",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              {row.original?.day_num}
            </div>
          );
        },
      },
      {
        Header: "عدد التمارين",
        accessor: "sessions",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              {row.original?.exercises?.length}
            </div>
          );
        },
      },
      {
        Header: "نوع التمارين",
        accessor: "exercise_category",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              {row.original?.exercise_category}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      <div className="grid grid-cols-5 gap-4">
        {cardData.map((item, index) => (
          <SettingCard
            id={item.id}
            key={index}
            label={item.label}
            active={active === item.id}
            onClick={() => setActive(item.id)}
          />
        ))}

        {data.length === 0 && (
          <Card className={"p-4 w-[180px]"}>
            <label
              htmlFor="add-coupone"
              className={
                "flex flex-col cursor-pointer justify-between items-center relative"
              }
            >
              <Img
                className="w-16 absolute top-0 left-0"
                src="/images/plus.svg"
              />
              <Text size="3xl" className="mt-4">
                إضافة كوبون
              </Text>
            </label>
          </Card>
        )}
      </div>
      <Table
        data={data ?? []}
        columns={columns}
        modalContent={<AddCoupone />}
        id="add-coupone"
        modalTitle="إضافة كوبون"
      />

      <Modal id="add-coupone">
        <AddCoupone />
      </Modal>

      <Drawer>
        <CouponeSideBar />
      </Drawer>
    </div>
  );
}
