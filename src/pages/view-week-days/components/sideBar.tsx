import { Button, Card, Img, Input, Modal, Text } from "components";
import { Formik } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { Form, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddWeekDayExercise from "./add-day-exercise";
import { useAppSelector } from "hooks/useRedux";
import { selectIsImageDelete } from "redux/slices/imageDelete";
import { useState } from "react";
import AddWeekSpareDayExercise from "./add-spare-exercise";
import EditExerciseSessions from "./edit-exercise-session";

interface SideBarProps {
  weekDayData: any;
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
  return (
    <div className="border-[1px] border-primary rounded-md p-3 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Img src={exercise?.exercise_muscle_image} alt="image" />
          <Text>{exercise?.exercise_name ?? exercise?.exercise_id?.label}</Text>
        </div>

        <div className="flex items-center">
          <div className="rounded-full border-[1px] p-2">
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
        <div className="flex items-center">
          <div className="rounded-full border-[1px] p-2">
            <span className="me-2">{exercise?.rest_sec}</span> ثانية
          </div>
        </div>
      </div>

      {onAddSpareExercise !== undefined && (
        <Button secondaryBorder onClick={onAddSpareExercise}>
          إضافة تمرين بديل
        </Button>
      )}
      {onAddSpareExercise === undefined && (
        <Button secondaryBorder onClick={onDeleteEXercise}>
          <Img src="/images/trash.svg" />
        </Button>
      )}
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

function WeekDaySideBar({ weekDayData }: SideBarProps) {
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
  const url = `/training-week-days/${weekDayData?.id}`;
  const { mutateAsync: editWeekDay, isLoading: isEditLoading } = usePostQuery({
    url,
    contentType: "multipart/form-data",
  });

  const onSubmit = async (values: any, Helpers: any) => {
    const formData = new FormData();

    const exercises: any = [];

    values.exercises?.forEach((exercise: any) => {
      exercises.push(exercise);

      if (exercise.children?.length !== 0) {
        exercise.children?.forEach((children: any) => exercises.push(children));
      }
    });

    const formattedData = Object.entries({
      ...values,
      exercises,
    });

    formattedData.forEach((data) => {
      if (data[0] !== "exercises") {
        formData.append(data[0], data[1] as any);
      }

      if (data[0] === "exercises") {
        (data[1] as any).forEach((subData: any, i: number) => {
          Object.entries(subData).forEach((item: any) => {
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
            }

            if (item[0] === "sessions") {
              item[1].forEach((item: any, sessionIndex: number) =>
                Object.entries(item).forEach((session: any) => {
                  formData.append(
                    `exercises[${i}][sessions][${sessionIndex}][${session[0]}]`,
                    session[1] as any
                  );
                })
              );

              return;
            }
          });
        });
      }
    });

    formData.append("training_week_id", id as any);

    formData.append("_method", "PUT" as any);

    try {
      !isImageDelete && formData.delete("image");

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

  const [parentId, setParentId] = useState<number | null>(null);

  const onAddSpareExercise = (id: number) => {
    setParentId(id);
    document.getElementById("add-spare-weekday")?.click();
  };

  const onDeleteSpareExercise = (
    deletedExercise: any,
    values: any,
    setFieldValue: any
  ) => {
    const parentExercise = values.exercises.find(
      (exercise: any) => exercise.id === deletedExercise.parent_id
    );

    const filteredArray = parentExercise?.children?.filter(
      (exercise: any) =>
        exercise.exercise_name !== deletedExercise?.exercise_name
    );
    parentExercise.children = filteredArray;

    setFieldValue("exercises", [...values.exercises]);
  };

  const [editableExercise, setEditableExercise] = useState<any>(null);

  const onEditExercise = (exercise: any) => {
    setEditableExercise(exercise);

    document.getElementById("edit-exercise-sessions")?.click();
  };

  return (
    <Formik
      initialValues={{
        ...initialValues,
        ...weekDayData,
      }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, submitForm, setFieldValue }) => (
        <Form>
          <div className="flex flex-col gap-10 mb-10">
            <div className="flex gap-4">
              <Img
                className="w-24"
                src={weekDayData?.image || "/images/img_rectangle347.png"}
              />
              <div>
                <div className="flex items-center gap-4">
                  <Text as="h1" className="!text-[24px]">
                    اليوم رقم
                  </Text>
                  <Input
                    name="day_num"
                    className="!w-[80px] text-center font-bold text-[24px]"
                  />
                </div>
                <Text as="h5" size="3xl">
                  {values.exercise_category}
                </Text>
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

            <Card className="p-6">
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
                    <div className="border-[1px] rounded-lg p-4">
                      <SingleExercise
                        key={exercise?.name}
                        exercise={exercise}
                        onEditExercise={() => onEditExercise(exercise) as any}
                        onAddSpareExercise={() =>
                          onAddSpareExercise(exercise?.id)
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
                                subExercise,
                                values,
                                setFieldValue
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
                              subExercise,
                              values,
                              setFieldValue
                            )
                          }
                        />
                      ))}
                    </div>
                  ))}

                <Button
                  secondaryBorder
                  className="!mt-5"
                  onClick={() =>
                    document.getElementById("add-week-day-side-bar")?.click()
                  }
                >
                  تعديل بيانات اليوم
                </Button>
              </div>
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
              <Button
                className="w-[100px]"
                danger
                onClick={onDeleteItem}
                isLoading={isLoading}
              >
                حذف
              </Button>
            </div>
          </div>

          <Modal id="add-week-day-side-bar" className="!h-full !w-full">
            <AddWeekDayExercise
              onAddExercise={() =>
                document.getElementById("add-week-day-side-bar")?.click()
              }
              isEditing={true}
            />
          </Modal>

          <Modal id="add-spare-weekday" className="!h-full !w-full">
            <AddWeekSpareDayExercise parentId={parentId} />
          </Modal>

          <Modal id="edit-exercise-sessions" className="!h-full !w-full">
            <EditExerciseSessions exercise={editableExercise} />
          </Modal>
        </Form>
      )}
    </Formik>
  );
}

export default WeekDaySideBar;
