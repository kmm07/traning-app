import { Button, Modal, Table } from "components";
import { Drawer } from "components/Drawer";
import { useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import React, { useState } from "react";
import { UseQueryResult } from "react-query";
import { useParams } from "react-router-dom";
import { Row } from "react-table";
import { toast } from "react-toastify";
import WeekDayForm from "./components/weekdayForm";
import WeekDayGymSideBar from "./components/gym-side-bar/sideBar";
import WeekDayHomeSideBar from "./components/home-side-bar/sideBar";

export default function ViewWeekDay() {
  const [active, setActive] = useState<any>(null);

  const { id } = useParams();

  // get notifications data =================>
  const url = `/training-week-days?training_week_id=${id}`;

  const { data = [], refetch }: UseQueryResult<any> = useGetQuery(url, url, {
    select: ({ data }: { data: { data: [] } }) => data.data,
    refetchOnWindowFocus: false,
  });

  // إعادة ترتيب الأيام: إرسال قائمة المعرّفات بالترتيب الجديد للباك إند
  const { mutateAsync: reorderDays, isLoading: isReordering } = usePostQuery({
    url: "/training-week-days/reorder",
    withToast: false,
  });

  const moveDay = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= data.length || isReordering) return;

    const dayIds = data.map((day: any) => day.id);
    [dayIds[index], dayIds[target]] = [dayIds[target], dayIds[index]];

    await reorderDays({
      training_week_id: Number(id),
      day_ids: dayIds,
    } as any);

    toast.success("تم تحديث ترتيب الأيام");
    await refetch();
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "اليوم",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={row.original.image || "/images/img_rectangle347.png"}
                  />
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
        accessor: "name",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">{row.original?.name}</div>
          );
        },
      },
      {
        Header: "الترتيب",
        accessor: "reorder",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="btn btn-xs btn-outline"
                disabled={row.index === 0 || isReordering}
                onClick={() => moveDay(row.index, -1)}
              >
                ↑
              </button>
              <button
                type="button"
                className="btn btn-xs btn-outline"
                disabled={row.index === data.length - 1 || isReordering}
                onClick={() => moveDay(row.index, 1)}
              >
                ↓
              </button>
            </div>
          );
        },
      },
    ],
    [data, isReordering]
  );

  const rowOnClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent> | any
  ) => {
    const exercises = e.original.exercises?.map((exercise: any) => ({
      ...exercise,
      is_new: 0,

      sessions: exercise.sessions?.map((session: any) => ({
        ...session,
        is_new: 0,
      })),

      children: exercise.children?.map((children: any) => ({
        ...children,
        is_new: 0,
        sessions: children?.sessions?.map((item: any) => ({
          ...item,
          is_new: 0,
        })),
      })),
    }));

    setActive({ ...e.original, exercises });
  };

  const {
    home,
    gender,
    daysNum,
    trLevel,
    category,
    weekNum = "sss",
  } = JSON.parse(localStorage.getItem("week-days") as any);

  return (
    <div className="w-full space-y-4">
      <div className="col-span-1 text-white space-y-2">
        <h1 className="text-2xl font-bold ">
          جدول {home ? "منزل" : "جيم"} {gender === "female" ? "نساء" : "رجال"}
        </h1>

        <div className="text-lg">{trLevel}</div>

        <div className="text-lg"> السبوع رقم {weekNum}</div>
        <div className="text-lg">{daysNum} أيام في الاسبوع</div>

        <div>{category?.name}</div>
      </div>
      <Table
        data={data ?? []}
        columns={columns}
        rowOnClick={rowOnClick}
        modalContent={<WeekDayForm />}
        opnSideBar="إضافة يوم"
        opnSideBarOpen={() => setActive(null)}
        id="add-week-day"
      />
      {data.length === 0 && (
        <div className="flex justify-center mt-10">
          <Button
            onClick={() => document.getElementById("my-drawer")?.click()}
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
        {home === 0 ? (
          <WeekDayGymSideBar weekDayData={active} category={category} />
        ) : (
          <WeekDayHomeSideBar weekDayData={active} category={category} />
        )}
      </Drawer>
    </div>
  );
}
