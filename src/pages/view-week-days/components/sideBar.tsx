import { Button, Card, Img, Modal, Text } from "components";
import { Formik } from "formik";
import { useDeleteQuery, usePostQuery } from "hooks/useQueryHooks";
import { useQueryClient } from "react-query";
import { Form, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AddWeekDayExercise from "./add-day-exercise";
import { useAppSelector } from "hooks/useRedux";
import { selectIsImageDelete } from "redux/slices/imageDelete";

interface SideBarProps {
  weekDayData: any;
}

interface SingleExerciseProps {
  exercise_name: string;
  rest_sec: number;
  sessions: any;
  exercise_muscle_image: string;
  onDeleteEXercise: any;
}
const SingleExercise = ({
  exercise_name,
  sessions,
  exercise_muscle_image,
  rest_sec,
}: SingleExerciseProps) => {
  return (
    <div className="border-[1px] border-primary rounded-md p-3 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Img src={exercise_muscle_image} alt="image" />
          <Text>{exercise_name}</Text>
        </div>

        <div className="rounded-full border-[1px] p-2">
          الجلسات <span className="ms-4">{sessions.length}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Text as="h5">وقت الراحة</Text>
        <div className="flex items-center">
          <div className="rounded-full border-[1px] p-2">
            <span className="me-2">{rest_sec}</span> ثانية
          </div>
        </div>
      </div>
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

    const formattedData = Object.entries(values);

    formattedData.forEach((data) => {
      if (data[0] !== "exercises") {
        formData.append(data[0], data[1] as any);
      }

      if (data[0] === "exercises") {
        (data[1] as any).forEach((subData: any, i: number) => {
          Object.entries(subData).forEach((item: any) => {
            if (item[0] !== "sessions") {
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
            } else {
              item[1].forEach((item: any, sessionIndex: number) =>
                Object.entries(item).forEach((session: any) => {
                  formData.append(
                    `exercises[${i}][sessions][${sessionIndex}][${session[0]}]`,
                    session[1] as any
                  );
                })
              );
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

      document.getElementById("add-week-day")?.click();
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
  };

  return (
    <Formik
      initialValues={{ ...initialValues, ...weekDayData }}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {({ values, submitForm }) => (
        <Form>
          <div className="flex flex-col gap-10">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <Img className="w-24" src={values.image} />
                <div>
                  <Text as="h5" size="3xl">
                    اليوم رقم {values.day_num}
                  </Text>
                  <Text as="h5" size="3xl">
                    {values.exercise_category}
                  </Text>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex justify-between">
              <div className="flex gap-4">
                <Img
                  className="w-24"
                  src={weekDayData?.image || "/images/img_rectangle347.png"}
                />
                <Text size="3xl">asd</Text>
              </div>
            </div>

            <Card className="p-6">
              <Text as="h5" className="mb-3">
                هدف اليوم
              </Text>
              <Text as="h5">{values.target_text}</Text>
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
                {values.exercises?.map((exercise: any) => (
                  <SingleExercise key={exercise?.name} {...exercise} />
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
        </Form>
      )}
    </Formik>
  );
}

export default WeekDaySideBar;
