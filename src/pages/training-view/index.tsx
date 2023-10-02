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

  const [categoryData, setCategoryData] = useState(null);

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

      await queryClient.invalidateQueries(
        `/training-weeks?category_id=${exerciesCategory}`
      );
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onEditWeek = (week: any) => {
    setWeekData(week);

    document.getElementById("add-new-exercise")?.click();
  };

  const onViewWeek = (id: number, week_num: number) => {
    console.log(trainingCategories);

    console.log(exerciesCategory);

    // const category = trainingCategories?.find(
    //   (category: any) => exerciesCategory === category.id
    // );

    // //set local stoarge
    // localStorage.setItem(
    //   "week-days",
    //   JSON.stringify({
    //     home: category?.home,
    //     gender: category?.gender,
    //     daysNum: category?.days_num,
    //     level: category?.lvl,
    //     category: category?.name,
    //     weekNum: week_num,
    //   })
    // );
    navigate(`/exercises/week-days/${id}`);
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
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={row.original.image || "/images/img_rectangle347.png"}
                  />
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
            onView={() => onViewWeek(row.original.id, row.original.week_num)}
          />
        ),
      },
    ],
    []
  );

  useEffect(() => {
    setExerciseCategory(trainingCategories?.[0]?.id);
  }, [trainingCategories]);

  return (
    <div className="relative w-full space-y-4">
      <div className="grid grid-cols-7 gap-5">
        <div className="col-span-6">
          <h2>مستوي المتمرن</h2>
          <div className=" flex gap-3 h-24">
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
        </div>
        <div className="col-span-1 text-white space-y-2">
          <h1 className="text-2xl font-bold ">
            جدول {home ? "منزل" : "جيم"} {gender === "female" ? "نساء" : "رجال"}
          </h1>
          {cardData.map(
            (item) =>
              level === item.id && <div className="text-lg">{item.label}</div>
          )}

          <div className="text-lg">{daysNum} أيام في الاسبوع</div>

          {trainingCategories?.map(
            (category: any) =>
              exerciesCategory === category.id && <div>{category?.name}</div>
          )}
        </div>
      </div>
      <h2>عدد أيام التمرين</h2>
      <div className="flex gap-4">
        <Button
          onClick={() => setDaysNum(2)}
          primary={daysNum === 2}
          secondaryBorder={daysNum !== 2}
        >
          2 أيام في الاسبوع
        </Button>
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
              className={
                category.private === 1 ? "!border-[#CFFF0F]" : "!border-[#fff]"
              }
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
          id="add-new-exercise"
          modalContent={
            <WeekForm
              trainingWeeks={trainingWeeks}
              weekData={weekData}
              exerciesCategory={exerciesCategory as any}
              onClose={() => {
                document.getElementById("add-new-exercise")?.click();
                setWeekData(null);
              }}
            />
          }
        />
      ) : (
        <>loading....</>
      )}

      {trainingWeeks.length === 0 && (
        <div className="flex justify-center">
          <Button
            secondaryBorder
            onClick={() =>
              document.getElementById("add-new-exercise-empty")?.click()
            }
          >
            إضافة إسبوع
          </Button>
        </div>
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
      <Modal id="add-new-exercise-empty">
        <WeekForm
          trainingWeeks={trainingWeeks}
          weekData={weekData}
          exerciesCategory={exerciesCategory as any}
          onClose={() => {
            document.getElementById("add-new-exercise-empty")?.click();
            setWeekData(null);
          }}
        />
      </Modal>
    </div>
  );
}

export default TrainingView;
