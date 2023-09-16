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
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";

interface Props {
  isLoading?: boolean;
  isEditing?: boolean;
  onAddExercise?: any;
}

export default function AddWeekDayExercise({
  isEditing = false,
  isLoading = false,
  onAddExercise,
}: Props) {
  const { values, setFieldValue } = useFormikContext<any>();

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
  const exercisesURL = `/exercises?exercise_category_id=${values.exercise_category_id}`;

  const { data: exercises = [] }: UseQueryResult<any> = useGetQuery(
    exercisesURL,
    exercisesURL,
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.map((item: any) => ({ label: item?.name, value: item?.id })),
    }
  );

  const [exercise, setExercise] = useState<any>({
    exercise_id: "",
    rest_sec: "",
    private: false,
    sessions: {
      session_num: "",
      counter: "",
      rest_sec: "",
    },
  });

  const [exerciseSession, setExerciseSession] = useState<any>([]);

  const onAddSession = () => {
    setExerciseSession([
      ...exerciseSession,
      { ...exercise?.sessions, is_new: isEditing ? 1 : 0 },
    ]);
    setExercise({
      ...exercise,
      sessions: { session_num: "", counter: "", rest_sec: "" },
    });

    toast.success("تم إضافة الجسلة بنجاح");
  };

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

  return (
    <div>
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
                {
                  ...exercise,
                  sessions: exerciseSession,
                  is_new: isEditing ? 1 : 0,
                },
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
          <div className="my-6 border-[1px] rounded-md p-4">
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

                  <Button
                    onClick={() => {
                      const filteredArray = singleExercise.sessions.filter(
                        (item: any) => item !== session
                      );
                      singleExercise.sessions = filteredArray;

                      setFieldValue("exercises", [...values.exercises]);
                    }}
                  >
                    <Img src="/images/trash.svg" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              onClick={() =>
                onDeleteExercise(
                  values,
                  setFieldValue,
                  singleExercise?.exercise_id
                )
              }
              danger
            >
              حذف التمرين
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
          onClick={() => {
            document
              .getElementById(
                isEditing ? "add-week-day-side-bar" : "add-week-day"
              )
              ?.click();
          }}
        >
          الغاء
        </Button>

        <Button
          className={"!w-20"}
          primary
          type="button"
          isLoading={isLoading}
          onClick={onAddExercise}
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}
