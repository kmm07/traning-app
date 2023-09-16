import { Button, Modal, Table } from "components";
import { Drawer } from "components/Drawer";
import { useGetQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { Row } from "react-table";
import WeekDayForm from "./components";
import WeekDaySideBar from "./components/sideBar";

type Props = {};

export default function ViewWeekDay({}: Props) {
  const [active, setActive] = useState<any>();

  const { id } = useParams();

  // get notifications data =================>
  const url = `/training-week-days?training_week_id=${id}`;

  const { data = [] }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
  });

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

  const rowOnClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent> | any
  ) => {
    setActive(e.original);
  };

  return (
    <div className="w-full space-y-4">
      <Table
        data={data ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
        modalContent={<WeekDayForm />}
        modalTitle="اضافة يوم"
        id="add-week-day"
      />
      {data.length === 0 && (
        <div className="flex justify-center mt-10">
          <Button
            onClick={() => document.getElementById("add-week-day")?.click()}
            secondaryBorder
          >
            إضافة يوم
          </Button>
        </div>
      )}
      <Modal id="add-week-day">
        <WeekDayForm />
      </Modal>
      <Drawer>
        <WeekDaySideBar weekDayData={active} />
      </Drawer>
    </div>
  );
}
