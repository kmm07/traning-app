import { Button, CheckBox, Img, Input, Select, Text } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult } from "react-query";
import { toast } from "react-toastify";

interface Props {
  parentId?: number | null;
}

export default function AddWeekSpareDayExercise({ parentId }: Props) {
  const { values, setFieldValue } = useFormikContext<any>();

  const [extraData, setExtraData] = useState<any>();

  const [addedExercises, setAddedExercises] = useState<any>([]);

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
  const exercisesURL = `/exercises?exercise_category_id=${extraData?.exercise_category_id?.value}`;

  const { data: exercises = [] }: UseQueryResult<any> = useGetQuery(
    exercisesURL,
    exercisesURL,
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.map((item: any) => ({ label: item?.name, value: item?.id })),
      enabled: ![undefined, null, ""].includes(
        extraData?.exercise_category_id?.value
      ),
    }
  );

  const onAddSession = () => {
    setExerciseSession([
      ...exerciseSession,
      { ...exercise?.sessions, is_new: 1 },
    ]);
    setExercise({
      ...exercise,
      sessions: { session_num: "", counter: "", rest_sec: "" },
    });

    toast.success("تم إضافة الجسلة بنجاح");
  };

  const onDeleteExercise = (deletedExercise: any) => {
    const filteredArray = addedExercises?.exercises?.filter(
      (exercise: any) => exercise.exercise_id !== deletedExercise
    );

    setAddedExercises(filteredArray);
  };

  const onAddExercise = () => {
    setAddedExercises([
      ...addedExercises,
      {
        ...exercise,
        sessions: exerciseSession,
        parent_id: parentId,
        is_new: 1,
      },
    ]);

    setExercise({
      exercise_category_id: "",
      exercise_id: "",
      rest_sec: "",
      private: false,
      sessions: [],
    });

    setExerciseSession([]);
  };

  const onSaveExercises = () => {
    setFieldValue("exercises", [...values.exercises, ...addedExercises]);

    setAddedExercises([]);

    document.getElementById("add-spare-weekday")?.click();
  };

  return (
    <div>
      <Select
        options={categories ?? []}
        name="exercise_category_id"
        label="فئة التمرين"
        isLoading={isCategoriesLoading}
        isForm={false}
        onChange={(e: any) =>
          setExtraData({ ...extraData, exercise_category_id: e })
        }
        value={extraData?.exercise_category_id}
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

          <Button onClick={onAddExercise} primary className="!my-6">
            إضافة تمرين
          </Button>
        </div>

        {/* added exercises */}
        {addedExercises?.map((singleExercise: any) => (
          <div className="my-6 border-[1px] rounded-md p-4">
            <Text as="h5">{singleExercise?.name}</Text>

            <Text as="h5">{singleExercise?.exercise_id?.label}</Text>

            <Text>{singleExercise?.rest_sec} ثانية راحة</Text>

            <Text as="h5">
              {[0, false].includes(singleExercise?.private)
                ? "تمرين عام"
                : "تمرين خاص"}
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
              onClick={() => onDeleteExercise(singleExercise?.exercise_id)}
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
            document.getElementById("add-spare-weekday")?.click();
          }}
        >
          الغاء
        </Button>

        <Button
          className={"!w-20"}
          primary
          type="button"
          onClick={onSaveExercises}
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}
