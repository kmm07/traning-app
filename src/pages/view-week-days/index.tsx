import { Card, Img, Modal, SettingCard, Table, Text } from "components";
import { Drawer } from "components/Drawer";
import { useGetQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { Row } from "react-table";

type Props = {};

export default function ViewWeekDay({}: Props) {
  const [active, setActive] = useState<any>();

  const { id } = useParams();

  // get notifications data =================>
  const url = `/training-week-days?training_week_id=${id}`;

  const { data }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

  console.log(data);

  const columns = React.useMemo(
    () => [
      {
        Header: "اسم التمرين",
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
              {row.original.exercise_name}
            </div>
          );
        },
      },
      {
        Header: "وقت الراحة",
        accessor: "rest_sec",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              {row.original.rest_sec} ثانية
            </div>
          );
        },
      },
      {
        Header: "عدد المجموعات",
        accessor: "sessions",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              {row.original.sessions?.length} مجموعة
            </div>
          );
        },
      },
    ],
    []
  );

  const rowOnClick = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>) => {
    console.log(e);
  };

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-5 gap-4">
        {data?.map((item: any, index: any) => (
          <SettingCard
            id={item.id}
            key={index}
            label={item.exercise_category}
            active={active.id === item.id}
            onClick={() => setActive(item as any)}
          />
        ))}

        <Card className={"p-4 w-[180px]"}>
          <label
            htmlFor="add-new-exercise-category"
            className={`flex flex-col cursor-pointer justify-between items-center relative `}
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
        data={active.exercises ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
      />

      <Drawer>asd</Drawer>

      <Modal id="add-week-day">
        <>asd</>
      </Modal>
    </div>
  );
}
