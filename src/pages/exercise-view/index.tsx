import { Button, Card, Img, Modal, SettingCard, Table, Text } from "components";
import React, { useEffect, useState } from "react";
import { Drawer } from "components/Drawer";
import { Row } from "react-table";
import SideBar from "./components/SideBar";
import { UseQueryResult, useQueryClient } from "react-query";
import { useDeleteQuery, useGetQuery } from "hooks/useQueryHooks";
import { toast } from "react-toastify";
import ExerciseCategoryForm from "./components/exerciseCategoryForm";
import AddExercise from "./components/AddExercise";

interface Props {
  home: number;
}

function ExercisesView({ home }: Props) {
  const [categoryData, setCategoryData] = useState<any>();

  // get exercises categories ======================>
  const url = "/exercise-categories";

  const { data: exerciseCategories = [] }: UseQueryResult<any> = useGetQuery(
    url,
    url,
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.filter((category: any) => category.home === home),
    }
  );

  // categories actions ======================>
  const { mutateAsync } = useDeleteQuery();

  const queryClient = useQueryClient();

  const onDelete = async (id: number) => {
    try {
      await mutateAsync(`/exercise-categories/${id}`);

      await queryClient.invalidateQueries("/exercise-categories");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const onEdit = (value: any) => {
    setCategoryData(value);
    document.getElementById("new-exercise-category")?.click();
  };

  // list exercises =======================>
  const [exerciseData, setExerciseData] = useState<any>();

  const exercisesListURL = `/exercises?exercise_category_id=${categoryData?.id}`;

  const {
    data: exerciseList = [],
    isLoading: isListLoading,
  }: UseQueryResult<any> = useGetQuery(exercisesListURL, exercisesListURL, {
    select: ({ data }: { data: { data: [] } }) => data.data,
    enabled: ![null, undefined].includes(categoryData?.id),
  });

  const columns = React.useMemo(
    () => [
      {
        Header: "التمرين",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <div className="flex items-center gap-4">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-full">
                  <img
                    src={
                      row.original.muscle_image ||
                      "/images/img_rectangle347.png"
                    }
                  />
                </div>
              </div>
              {row.original.name}
            </div>
          );
        },
      },

      {
        Header: "فئة التمرين",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.category_name}
            </span>
          );
        },
      },

      {
        Header: "ملاحظات التمرين",
        Cell: ({ row }: { row: Row<any> }) => {
          return (
            <span className="flex items-center gap-4">
              {row.original.notes}
            </span>
          );
        },
      },
    ],
    []
  );

  const rowOnClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent> | any
  ) => {
    setExerciseData(e.original);
  };

  useEffect(() => {
    setCategoryData(exerciseCategories?.[0]);
  }, [exerciseCategories]);

  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {exerciseCategories.map((item: any) => (
          <SettingCard
            onDelete={onDelete}
            onEdit={() => onEdit(item)}
            id={item.id}
            key={item.id}
            label={item.name}
            active={categoryData?.id === item.id}
            onClick={() => setCategoryData(item)}
          />
        ))}
        <Card className={"p-4 w-[180px]"}>
          <label
            htmlFor="new-exercise-category"
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

      {!isListLoading ? (
        exerciseList.length !== 0 ? (
          <Table
            data={exerciseList ?? []}
            columns={columns}
            rowOnClick={rowOnClick}
            modalTitle="اضافة تمرين"
            modalContent={
              <AddExercise exercise_category_id={categoryData?.id} />
            }
            id="add-new-exercise"
          />
        ) : (
          <>
            <Modal id="add-new-exercise">
              <AddExercise exercise_category_id={categoryData?.id} />
            </Modal>
            <div
              className="flex justify-center"
              onClick={() =>
                document.getElementById("add-new-exercise")?.click()
              }
            >
              <Button secondaryBorder>إضافة تمرين جديد</Button>
            </div>
          </>
        )
      ) : (
        <>loading...</>
      )}

      <Drawer>
        <SideBar exerciseData={exerciseData} categoryData={categoryData} />
      </Drawer>

      <Modal id="new-exercise-category">
        <ExerciseCategoryForm
          categoryData={categoryData}
          setCategoryData={setCategoryData}
        />
      </Modal>

      <Modal id="add-new-exercise">
        <AddExercise exercise_category_id={categoryData?.id} />
      </Modal>
    </div>
  );
}

export default ExercisesView;
