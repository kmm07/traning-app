import { Button, SettingCard, SubState, Table } from "components";
import React, { useState } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult } from "react-query";

function MenTraining() {
  const [level, setLevel] = useState<"junior" | "mid" | "senior">("junior");

  const [daysNum, setDaysNum] = useState<number>(3);

  const [home, setHome] = useState<number>(0);

  const [exerciesCategory, setExerciseCategory] = useState<number | null>(null);

  // get training categories ======================>
  const url = `/training-categories?lvl=${level}&gender=male&days_num=${daysNum}&home=${home}`;

  const { data: trainingCategories = [], isLoading }: UseQueryResult<any> =
    useGetQuery(url, url, {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.map(({ id, name }: { id: number; name: string }) => ({
          id,
          name,
        })),
    });

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
      id: "junior",
    },
    {
      label: "متوسط",
      id: "mid",
    },
    {
      label: "متقدم",
      id: "senior",
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
      <h2>مستوي المتمرن</h2>
      <div className="flex gap-3 h-24">
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

      <h2>عدد أيام التمرين</h2>
      <div className="flex gap-4">
        <Button
          onClick={() => setDaysNum(3)}
          primary={daysNum === 3}
          secondaryBorder={daysNum !== 3}
        >
          3 أيام في الاسبوع
        </Button>
        <Button
          onClick={() => setDaysNum(4)}
          primary={daysNum === 4}
          secondaryBorder={daysNum !== 4}
        >
          4 أيام في الاسبوع
        </Button>
        <Button
          onClick={() => setDaysNum(5)}
          primary={daysNum === 5}
          secondaryBorder={daysNum !== 5}
        >
          5 أيام في الاسبوع
        </Button>
        <Button
          onClick={() => setDaysNum(6)}
          primary={daysNum === 6}
          secondaryBorder={daysNum !== 6}
        >
          6 أيام في الاسبوع
        </Button>
      </div>
      {/* exercise categories */}
      <h2>أقسام التمرينات</h2>
      <div className="flex items-center gap-3 flex-wrap">
        {!isLoading
          ? trainingCategories.length > 0
            ? trainingCategories.map((category) => (
                <Button
                  onClick={() => setExerciseCategory(category.id)}
                  primary={exerciesCategory === category.id}
                  secondaryBorder={exerciesCategory !== category.id}
                >
                  {category?.name}
                </Button>
              ))
            : "لا يوجد أقسام"
          : "loading..."}
      </div>

      <Table
        data={[]}
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
