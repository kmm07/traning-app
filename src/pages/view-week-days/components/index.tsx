import {
  Button,
  CheckBox,
  Img,
  Input,
  Select,
  Text,
  TextArea,
  UploadInput,
} from "components";
import { Form, Formik } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult } from "react-query";
// import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
const initialValues = {
  name: "",
  day_num: "",
  exercise_category_id: "",
  target_text: "",
  image: "",
  exercises: [],
};

export default function WeekDayForm() {
  // const { id } = useParams();

  // get exercieses categories ===============>
  const categoriesURL = "/exercise-categories";

  const {
    data: categories,
    isLoading: isCategoriesLoading,
  }: UseQueryResult<any> = useGetQuery(categoriesURL, categoriesURL, {
    select: ({ data }: { data: { data: [] } }) =>
      data.data.map((item: any) => ({ label: item?.name, value: item?.id })),
  });

  // get exercieses  ===============>
  const exercisesURL = "/exercise-categories";

  const { data: exercises = [] }: UseQueryResult<any> = useGetQuery(
    exercisesURL,
    exercisesURL,
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.map((item: any) => ({ label: item?.name, value: item?.id })),
    }
  );

  const onClose = () => document.getElementById("add-week-day")?.click();

  const onDeleteExercise = (
    values: any,
    setFieldValue: any,
    deletedExercise: any
  ) => {
    const filteredArray = values.exercises?.filter(
      (exercise: any) => exercise.exercise_id !== deletedExercise
    );

    setFieldValue("exercises", filteredArray);
  };

  const [exercise, setExercise] = useState<any>({
    exercise_id: "",
    rest_sec: "",
    private: false,
    sessions: [],
  });

  const [exerciseSession, setExerciseSession] = useState<any>([]);

  const onAddSession = () => {
    setExerciseSession([...exerciseSession, exercise?.sessions]);
    setExercise({
      ...exercise,
      sessions: { session_num: "", counter: "", rest_sec: "" },
    });

    toast.success("تم إضافة الجسلة بنجاح");
  };

  // on submit weekday data ======================>
  // const url = "/training-week-days";
  // const { mutateAsync, isLoading } = usePostQuery({
  //   url,
  //   contentType: "multipart/form-data",
  // });

  const onSubmit = async (values: any, Helpers: any) => {
    const formData = new FormData();

    const formattedData = Object.entries(values);

    formattedData.forEach((data) => {
      if (data[0] !== "exercises") {
        formData.append(data[0], data[1] as any);
      }

      if (data[0] === "exercises") {
        (data[1] as any).forEach((subData: any, index: number) => {
          if (subData[0] !== "sessions") {
            formData.append(
              `exercises[${index}][exercise_id]`,
              subData[1]?.value as any
            );
            formData.append(
              `exercises[${index}][private]`,
              subData.private ? 1 : (0 as any)
            );
            formData.append(
              `exercises[${index}][rest_sec]`,
              subData.rest_sec as any
            );
          } else console.log(subData);
        });
      }
    });

    try {
      // await mutateAsync(formData);
      Helpers.resetForm();
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {({ values, setFieldValue }) => (
        <Form>
          <UploadInput name="image" />
          <div className="grid grid-cols-2 gap-4">
            <Input name="name" label="الإسم" />

            <Input name="day_num" label="رقم اليوم" />

            <Select
              options={categories ?? []}
              name="exercise_category_id"
              label="فئة التمرين"
              isLoading={isCategoriesLoading}
            />
          </div>

          <TextArea
            name="target_text"
            label="هدف التمرين"
            className="border-[1px]"
          />

          <div className="my-6">
            <Text>تمارين اليوم:</Text>
            <div className="grid grid-cols-2 gap-4">
              <Select
                name="exercise_id"
                options={exercises}
                label="التمرين"
                isForm={false}
                onChange={(e) => setExercise({ ...exercise, exercise_id: e })}
                value={exercise?.exercise_id}
              />
              <Input
                name="rest_sec"
                label="وقت الراحة"
                isForm={false}
                type={"number" as any}
                onChange={(e) =>
                  setExercise({ ...exercise, rest_sec: e.target.value })
                }
                value={exercise?.rest_sec}
              />

              <CheckBox
                name="private"
                label="تمرين خاص"
                isForm={false}
                onChange={() =>
                  setExercise({ ...exercise, private: !exercise?.private })
                }
                value={exercise?.private}
              />
            </div>
            <div className="my-6">
              <Text> جلسات التمرين:</Text>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  name="sessions-nums"
                  label="عدد جلسات التمرين"
                  onChange={(e) =>
                    setExercise({
                      ...exercise,
                      sessions: {
                        ...exercise?.sessions,
                        session_num: e.target.value,
                      },
                    })
                  }
                  value={exercise?.session?.session_num}
                  isForm={false}
                />

                <Input
                  name="counter"
                  label="العدد"
                  onChange={(e) =>
                    setExercise({
                      ...exercise,
                      sessions: {
                        ...exercise?.sessions,
                        counter: e.target.value,
                      },
                    })
                  }
                  value={exercise?.session?.counter}
                  isForm={false}
                />

                <Input
                  name="rest_sec"
                  label="وقت الراحة"
                  onChange={(e) =>
                    setExercise({
                      ...exercise,
                      sessions: {
                        ...exercise?.sessions,
                        rest_sec: e.target.value,
                      },
                    })
                  }
                  value={exercise?.session?.rest_sec}
                  isForm={false}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={onAddSession} secondaryBorder>
                إضافة جلسة
              </Button>

              <Button
                onClick={() => {
                  setFieldValue("exercises", [
                    ...values.exercises,
                    { ...exercise, sessions: exerciseSession },
                  ]);

                  setExercise({
                    exercise_id: "",
                    rest_sec: "",
                    private: false,
                    sessions: [],
                  });
                  setExerciseSession([]);
                }}
                primary
                className="!my-6"
              >
                إضافة تمرين
              </Button>
            </div>

            {/* added exercises */}
            {values.exercises?.map((singleExercise: any) => (
              <div className="my-6">
                <Text as="h5">{singleExercise?.exercise_id?.label}</Text>

                <Text>{singleExercise?.rest_sec} ثانية راحة</Text>

                <Text as="h5">
                  {singleExercise?.private === 0 ? "تمرين عام" : "تمرين خاص"}
                </Text>

                <div className="mt-4">
                  <Text>جلسات التمرين:</Text>
                  {singleExercise.sessions?.map((session: any) => (
                    <div className="my-4">
                      <Text as="h5">{session.session_num} عدد الجلسات</Text>

                      <Text as="h5">{session.counter} عداد العدات</Text>

                      <Text as="h5">{session.rest_sec} ثانية راحة</Text>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() =>
                    onDeleteExercise(
                      values,
                      setFieldValue,
                      exercise?.exercise_id
                    )
                  }
                >
                  <Img src="/images/trash.svg" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <Button
              className="!w-20"
              tertiary
              type="reset"
              secondary
              onClick={onClose}
            >
              الغاء
            </Button>

            <Button className={"!w-20"} primary type="submit" isLoading={false}>
              حفظ
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
