import { Button, Card, Img, Input, Modal, Text, UploadInput } from "components";
import { Formik, useFormikContext } from "formik";
import { useDeleteQuery, useGetQuery, usePostQuery } from "hooks/useQueryHooks";
import { UseQueryResult, useQueryClient } from "react-query";
import { Form, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddWeekDayExercise from "../home-side-bar/add-day-exercise";
import { useAppSelector } from "hooks/useRedux";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import { useState } from "react";
import AddWeekSpareDayExercise from "./add-spare-exercise";
import EditExerciseSessions from "./edit-exercise-session";

interface SideBarProps {
  weekDayData: any;
  category: any;
}

interface SingleExerciseProps {
  exercise: any;
  onAddSpareExercise?: () => void;
  onDeleteEXercise?: () => void;
  onEditExercise?: (exercise: any) => void;
}
const SingleExercise = ({
  exercise,
  onAddSpareExercise,
  onDeleteEXercise,
  onEditExercise,
}: SingleExerciseProps) => {
  const { values, setFieldValue } = useFormikContext<any>();

  return (
    <div className="border-[1px] border-primary rounded-md p-3 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Img src={exercise?.exercise_muscle_image} alt="image" />
          <Text>{exercise?.exercise_name ?? exercise?.exercise_id?.label}</Text>
        </div>

        <div className={"flex items-center"}>
          <div
            className={`rounded-full border-[1px] p-2  ${
              exercise?.sessions?.length === 0
                ? "text-red-600 !border-red-600"
                : ""
            }`}
          >
            الجلسات <span className="ms-4">{exercise?.sessions?.length}</span>
          </div>
          <div>
            <Button onClick={onEditExercise as any}>
              <Img src="/images/edit.svg" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Text as="h5">وقت الراحة</Text>
        <div className="flex items-center gap-2 w-[120px]">
          <Input
            name="rest_sec"
            isForm={false}
            value={exercise?.rest_sec}
            onChange={(e) => {
              exercise.rest_sec = e.target.value;
              setFieldValue("exercises", [...values.exercises]);
            }}
          />{" "}
          <span>ثانية</span>
        </div>
      </div>

      {onAddSpareExercise !== undefined && (
        <Button secondaryBorder onClick={onAddSpareExercise}>
          إضافة تمرين بديل
        </Button>
      )}
      <Button secondaryBorder onClick={onDeleteEXercise} className="!mt-4">
        <Img src="/images/trash.svg" />
      </Button>
    </div>
  );
};

const initialValues = {
  name: "",
  day_num: "",
  exercise_category_id: "",
  target_text: "",
  image: "",
  exercises: [],
};

function WeekDayGymSideBar({ weekDayData, category }: SideBarProps) {
  const { id } = useParams();

  const onClose = () => document.getElementById("my-drawer")?.click();
  // weekday actions =====================>
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useDeleteQuery();

  const onDeleteItem = async () => {
    try {
      await mutateAsync(`/training-week-days/${weekDayData?.id}`);

      await queryClient.invalidateQueries(
        `/training-week-days?training_week_id=${id}`
      );
      onClose();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const isImageDelete = useAppSelector(selectIsImageDelete);

  // on submit weekday data ======================>
  const isEditing = weekDayData !== null;

  const url = isEditing
    ? `/training-week-days/${weekDayData?.id}`
    : "/training-week-days";

  const { mutateAsync: editWeekDay, isLoading: isEditLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onSubmit = async (values: any, Helpers: any) => {
    const formData = new FormData();

    const formattedData = Object.entries(values);

    formattedData.forEach((data: any) => {
      if (data[0] === "exercise_category_id") {
        formData.append("exercise_category_id", data?.[1].value as any);

        return;
      }
      if (data[0] !== "exercises") {
        formData.append(data[0], data[1] as any);
      }

      if (data[0] === "exercises") {
        (data[1] as any).forEach((subData: any, i: number) => {
          Object.entries(subData).forEach((item: any) => {
            if (item[0] === "children" && item[1].length > 0) {
              item[1]?.forEach((child: any, childIndex: number) => {
                child.is_new === 0 &&
                  formData.append(
                    `exercises[${i}][children][${childIndex}][id]`,
                    child.id
                  );
                formData.append(
                  `exercises[${i}][children][${childIndex}][exercise_id]`,
                  child.exercise_id?.value ?? child.exercise_id
                );

                formData.append(
                  `exercises[${i}][children][${childIndex}][parent_id]`,
                  child.parent_id
                );

                formData.append(
                  `exercises[${i}][children][${childIndex}][is_new]`,
                  child.is_new
                );

                formData.append(
                  `exercises[${i}][children][${childIndex}][rest_sec]`,
                  child.rest_sec
                );

                formData.append(
                  `exercises[${i}][children][${childIndex}][private]`,
                  child?.private === true ? 1 : (0 as any)
                );

                child.sessions?.forEach(
                  (session: any, sessionIndex: number) => {
                    formData.append(
                      `exercises[${i}][children][${childIndex}][sessions][${sessionIndex}][session_num]`,
                      session?.session_num
                    );

                    formData.append(
                      `exercises[${i}][children][${childIndex}][sessions][${sessionIndex}][counter]`,
                      session?.counter
                    );

                    formData.append(
                      `exercises[${i}][children][${childIndex}][sessions][${sessionIndex}][rest_sec]`,
                      session?.rest_sec
                    );
                    formData.append(
                      `exercises[${i}][children][${childIndex}][sessions][${sessionIndex}][notes]`,
                      session?.notes
                    );
                    formData.append(
                      `exercises[${i}][children][${childIndex}][sessions][${sessionIndex}][is_new]`,
                      session?.is_new
                    );
                    session?.is_new === 0 &&
                      formData.append(
                        `exercises[${i}][children][${childIndex}][sessions][${sessionIndex}][id]`,
                        session?.id
                      );
                  }
                );
              });

              return;
            }

            if (item[0] !== "sessions") {
              if (item[0] === "parent_id") {
                formData.append(
                  `exercises[${i}][${item[0]}]`,
                  item[1] === null ? "" : item[1]
                );
              } else {
                formData.append(
                  `exercises[${i}][${item[0]}]`,
                  item[0] === "exercise_id"
                    ? item[1].value ?? item[1]
                    : item[0] === "private"
                    ? item[1]
                      ? 1
                      : 0
                    : item[1]
                );
              }
              return;
            } else
              item[1].forEach((item: any, sessionIndex: number) =>
                Object.entries(item).forEach((session: any) => {
                  if (session[0] !== "notes") {
                    formData.append(
                      `exercises[${i}][sessions][${sessionIndex}][${session[0]}]`,
                      session[1] as any
                    );
                  } else {
                    session[0] === null
                      ? ""
                      : formData.append(
                          `exercises[${i}][sessions][${sessionIndex}][notes]`,
                          session[1] as any
                        );
                  }
                })
              );
          });
        });
      }
    });

    formData.append("training_week_id", id as any);

    isEditing && formData.append("_method", "PUT" as any);

    try {
      !isImageDelete && isEditing && formData.delete("image");

      await editWeekDay(formData as any);

      Helpers.resetForm();

      queryClient.invalidateQueries(
        `/training-week-days?training_week_id=${id}`
      );

      document.getElementById("my-drawer")?.click();
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
  };

  const [parent, setParent] = useState<number | null>(null);

  const onAddSpareExercise = async (exercise: number) => {
    await setParent(exercise);
    document.getElementById("add-spare-weekday")?.click();
  };

  const onDeleteSpareExercise = (
    exercise: any,
    deletedExercise: any,
    setFieldValue: any,
    values: any
  ) => {
    const filteredArray = exercise.children?.filter(
      (child: any) =>
        child.exercise_id?.value !== deletedExercise?.exercise_id?.value
    );

    exercise.children = filteredArray;

    setFieldValue("exercises", [...values.exercises]);
  };

  const [editableExercise, setEditableExercise] = useState<any>(null);

  const onEditExercise = (exercise: any) => {
    setEditableExercise(exercise);

    document.getElementById("edit-exercise-sessions")?.click();
  };

  // get exercieses categories ===============>
  const categoriesURL = "/exercise-categories";

  const { data: categories }: UseQueryResult<any> = useGetQuery(
    categoriesURL,
    categoriesURL,
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.map((item: any) => ({ label: item?.name, value: item?.id })),
      refetchOnWindowFocus: false,
    }
  );

  const onDeleteMainExercise = (
    exercise: any,
    values: any,
    setFieldValue: any
  ) => {
    const mainExercises = values.exercises?.filter(
      (item: any) => item.parent_id === null
    );
    const filteredExercises = mainExercises.filter(
      (exer: any) =>
        (exer.id ?? exer.exercise_id?.value) !==
        (exercise.id ?? exercise.exercise_id?.value)
    );
    setFieldValue("exercises", filteredExercises);
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...weekDayData,
        exercise_category_id: {
          label: category?.name,
          value: category?.id,
        },
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, submitForm, setFieldValue }) => (
        <Form>
          <div className="flex flex-col gap-10 mb-10">
            <div className="flex gap-4">
              <UploadInput name="image" />
              <div>
                <div className="flex items-center gap-4">
                  <Text as="h1" className="!text-[24px]">
                    اليوم رقم
                  </Text>
                  <Input
                    name="day_num"
                    className="!w-[200px] text-center font-bold text-[24px]"
                  />
                </div>
                {/* <Select
                  options={categories ?? []}
                  name="exercise_category_id"
                  label="فئة التمرين"
                  isForm={false}
                  onChange={(e) => setFieldValue("exercise_category_id", e)}
                  value={values.exercise_category_id}
                /> */}

                <div className="flex items-center gap-4 mt-6">
                  <Text as="h1" className="!text-[24px]">
                    اسم اليوم
                  </Text>
                  <Input name="name" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-10">
            <Card className="p-6">
              <Text as="h5" className="mb-3">
                هدف اليوم
              </Text>
              <Input name="target_text" />
            </Card>

            <Card className="relative p-6 !min-h-[400px]">
              <div className="flex items-center justify-between mb-3 pb-4 border-b-[1px]">
                <Text as="h5" className="text-[20px]">
                  التمارين
                </Text>
                <Text
                  as="h5"
                  className="text-[20px] border-[1px] border-[#CFFF0F] p-2 rounded-md"
                >
                  عدد التمارين
                  <Text className="ms-4 font-bold text-xl">
                    {values.exercises?.length}
                  </Text>
                </Text>
              </div>
              <div className="pb-4 border-b-[1px]">
                {values.exercises
                  .filter((exercise: any) => exercise.parent_id === null)
                  ?.map((exercise: any) => (
                    <div className="border-[1px] rounded-lg p-4 !mb-6 ">
                      <SingleExercise
                        key={exercise?.name}
                        exercise={exercise}
                        onEditExercise={() => onEditExercise(exercise) as any}
                        onAddSpareExercise={() => onAddSpareExercise(exercise)}
                        onDeleteEXercise={() =>
                          onDeleteMainExercise(exercise, values, setFieldValue)
                        }
                      />
                      <Text as="h5" className="!mb-2">
                        التمرينات البديلة:
                      </Text>
                      {values.exercises
                        ?.filter((item: any) => item.parent_id === exercise?.id)
                        ?.map((subExercise: any) => (
                          <SingleExercise
                            key={exercise?.name}
                            exercise={subExercise}
                            onEditExercise={() =>
                              onEditExercise(subExercise) as any
                            }
                            onDeleteEXercise={() =>
                              onDeleteSpareExercise(
                                exercise,
                                subExercise,
                                setFieldValue,
                                values
                              )
                            }
                          />
                        ))}

                      {exercise?.children?.map((subExercise: any) => (
                        <SingleExercise
                          key={exercise?.name}
                          exercise={subExercise}
                          onEditExercise={() =>
                            onEditExercise(subExercise) as any
                          }
                          onDeleteEXercise={() =>
                            onDeleteSpareExercise(
                              exercise,
                              subExercise,
                              setFieldValue,
                              values
                            )
                          }
                        />
                      ))}
                    </div>
                  ))}

                <Button
                  className="!mt-5 flex items-center gap-1"
                  onClick={() =>
                    document.getElementById("add-week-day-exercise")?.click()
                  }
                >
                  <Img src="/images/plus.svg" />
                  <Text> إضافة تمرين</Text>
                </Button>
              </div>
              <Modal id="add-week-day-exercise" modalClassName="absolute">
                <AddWeekDayExercise categories={categories} />
              </Modal>

              <Modal id="add-spare-weekday" modalClassName="absolute">
                <AddWeekSpareDayExercise
                  parent={parent}
                  isEditing={weekDayData !== null}
                />
              </Modal>

              <Modal id="edit-exercise-sessions" modalClassName="absolute">
                <EditExerciseSessions exercise={editableExercise} />
              </Modal>
            </Card>

            <div className="flex items-center justify-evenly mt-6">
              <Button
                className="w-[100px]"
                primary
                isLoading={isEditLoading}
                onClick={submitForm}
              >
                حفظ
              </Button>
              <Button className="w-[100px]" primary onClick={onClose}>
                إلغاء
              </Button>
              {isEditing && (
                <Button
                  className="w-[100px]"
                  danger
                  onClick={onDeleteItem}
                  isLoading={isLoading}
                >
                  حذف
                </Button>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default WeekDayGymSideBar;
