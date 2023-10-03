import { Button, Input, Select, Text } from "components";
import { useFormikContext } from "formik";
import { useGetQuery } from "hooks/useQueryHooks";
import { useState } from "react";
import { UseQueryResult } from "react-query";

interface Props {
  isLoading?: boolean;
  onAddExercise?: any;
  categories: any;
}

export default function AddWeekDayExercise({
  isLoading = false,
  categories,
}: Props) {
  const { values, setFieldValue } = useFormikContext<any>();

  // get exercieses  ===============>
  const exercisesURL = `/exercises?exercise_category_id=${values.new_exercise_category_id}`;

  const { data: exercises = [] }: UseQueryResult<any> = useGetQuery(
    exercisesURL,
    exercisesURL,
    {
      select: ({ data }: { data: { data: [] } }) =>
        data.data.map((item: any) => ({ label: item?.name, value: item?.id })),
      enabled: ![undefined, null, ""].includes(values.new_exercise_category_id),
      refetchOnWindowFocus: false,
    }
  );

  const [exercise, setExercise] = useState<any>({
    exercise_id: "",
    rest_sec: "",
    private: false,
    is_new: 1,
    parent_id: null,
    sessions: [],
    children: [],
  });

  const onAddNewExercise = () => {
    setFieldValue("exercises", [...values.exercises, exercise]);

    setFieldValue("new_exercise_category_id", null);

    setExercise({
      exercise_id: "",
      rest_sec: "",
      private: false,
      is_new: 1,
      parent_id: null,
      sessions: [],
      children: [],
    });

    document.getElementById("add-week-day-exercise")?.click();
  };

  return (
    <div>
      <Select
        options={categories ?? []}
        name="new_exercise_category_id"
        label="فئة التمرين"
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
          isLoading={isLoading}
          onClick={onAddNewExercise}
        >
          حفظ
        </Button>
      </div>
    </div>
  );
}
