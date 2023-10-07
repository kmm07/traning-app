import { Button, Input, Select, Text } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult } from "react-query";

interface Props {
  parent?: any;
  isEditing: boolean;
}

export default function AddWeekSpareDayExercise({ parent }: Props) {
  const { values, setFieldValue } = useFormikContext<any>();

  const [extraData, setExtraData] = useState<any>();

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

  // get exercieses categories ===============>
  const categoriesURL = "/exercise-categories";

  const {
    data: categories,
    isLoading: isCategoriesLoading,
  }: UseQueryResult<any> = useGetQuery(categoriesURL, categoriesURL, {
    select: ({ data }: { data: { data: [] } }) =>
      data.data.map((item: any) => ({ label: item?.name, value: item?.id })),
    refetchOnWindowFocus: false,
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
      refetchOnWindowFocus: false,
    }
  );

  const onSaveExercises = () => {
    parent.children = [
      ...parent.children,
      {
        ...exercise,
        sessions: [],
        parent_id: parent.id ?? "",
        is_new: 1,
      },
    ];

    setFieldValue("exercises", [...values.exercises]);

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
            name="counter"
            label="العدد"
            isForm={false}
            type={"number" as any}
            onChange={(e) =>
              setExercise({ ...exercise, counter: e.target.value })
            }
            value={exercise?.counter}
          />
          <Input
            name="timer"
            label="الوقت بالدقائق"
            isForm={false}
            type={"number" as any}
            onChange={(e) =>
              setExercise({ ...exercise, timer: e.target.value })
            }
            value={exercise?.timer}
          />

          <Input
            isForm={false}
            name="rest_sec"
            label="وقت الراحة بالثواني"
            value={exercise.rest_sec}
            onChange={(e) => {
              exercise.rest_sec = e.target.value;
              setFieldValue("exercises", [...values.exercises]);
            }}
          />
        </div>
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
