import { Button, Card, Img, Modal, SettingCard, Table, Text } from "components";
import React, { useState, useEffect } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import { UseQueryResult, useQueryClient } from "react-query";
import ExerciseCategoryForm from "./exerciseCategoryForm";
import WeekForm from "./createWeek";
import TableActions from "components/Table/actions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Props {
  home: number;
  gender: string;
}

function TrainingView({ home, gender }: Props) {
  const [level, setLevel] = useState<"junior" | "mid" | "senior">("junior");

  const [daysNum, setDaysNum] = useState<number>(3);

  const [exerciesCategory, setExerciseCategory] = useState<number | null>(null);

  const [categoryData, setCategoryData] = useState();

  const navigate = useNavigate();

  // get training categories ======================>
  const url = `/training-categories?lvl=${level}&gender=${gender}&days_num=${daysNum}&home=${home}`;

  const { data: trainingCategories = [], isLoading }: UseQueryResult<any> =
    useGetQuery(url, url, {
      select: ({ data }: { data: { data: [] } }) => data.data,
    });

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

  // categories actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const queryClient = useQueryClient();

  const onDelete = async (id: number) => {
    try {
      await mutateAsync(`/training-categories/${id}`);

      await queryClient.invalidateQueries(
        `/training-categories?lvl=${level}&gender=male&days_num=${daysNum}&home=${home}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onEdit = (value: any) => {
    setCategoryData(value);
    document.getElementById("add-new-exercise-category")?.click();
  };

  // get training weeks ==================>
  const weeksURL = `/training-weeks?category_id=${exerciesCategory}`;

  const {
    data: trainingWeeks = [],
    isLoading: isWeeksLoading,
  }: UseQueryResult<any> = useGetQuery(weeksURL, weeksURL, {
    select: ({ data }: { data: { data: [] } }) => data.data,
    enabled: ![null, undefined].includes(exerciesCategory as any),
  });

  const [weekData, setWeekData] = useState(null);

  const { mutateAsync: deleteWeek } = useDeleteQuery();

  const onDeleteWeek = async (id: number) => {
    try {
      await deleteWeek(`/training-weeks/${id}`);
      queryClient.invalidateQueries(
        `/training-weeks?category_id=${exerciesCategory}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onEditWeek = (week: any) => {
    setWeekData(week);

    document.getElementById("my_modal")?.click();
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
        Header: "عدد اسابيع التكرار",
        accessor: "repeat_week_num",
      },
      {
        Header: "نص الهدف",
        accessor: "target_text",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="max-w-[500px] break-words">
              {row.original.target_text}
            </div>
          );
        },
      },

      {
        Header: "رقم الإسبوع",
        accessor: "week_num",
      },
      {
        Header: "نوع الإسبوع",
        accessor: "week_type",
      },
      {
        Header: "actions",
        Cell: ({ row }: { row: any }) => (
          <TableActions
            onEdit={() => onEditWeek(row.original)}
            onDelete={() => onDeleteWeek(row.original.id)}
          />
        ),
      },
    ],
    []
  );

  const rowOnClick = (e: any) =>
    navigate(`/exercises/week-days/${e.original?.id}`);

  useEffect(() => {
    setExerciseCategory(trainingCategories?.[0]?.id);
  }, [trainingCategories]);

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
            onClick={() => setLevel(item.id as any)}
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

      <div className="grid grid-cols-4 gap-3">
        {!isLoading ? (
          trainingCategories?.map((category: any) => (
            <SettingCard
              onDelete={onDelete}
              onEdit={() => onEdit(category)}
              id={category.id}
              key={category.id}
              label={category?.name}
              active={exerciesCategory === category.id}
              onClick={() => setExerciseCategory(category.id)}
            />
          ))
        ) : (
          <>laoding...</>
        )}
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

      {!isWeeksLoading ? (
        <Table
          data={trainingWeeks ?? []}
          columns={columns}
          modalTitle="اضافة اسبوع"
          rowOnClick={rowOnClick}
          modalContent={
            <WeekForm
              weekData={weekData}
              setWeekData={setWeekData}
              exerciesCategory={exerciesCategory as any}
            />
          }
        />
      ) : (
        <>loading....</>
      )}

      <Drawer>
        <SideBar />
      </Drawer>

      <Modal id="add-new-exercise-category">
        <ExerciseCategoryForm
          categoryData={categoryData}
          setCategoryData={setCategoryData}
        />
      </Modal>
    </div>
  );
}

export default TrainingView;
