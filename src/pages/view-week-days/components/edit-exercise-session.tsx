import { Button, Img, Input, Text } from "components";
import { useFormikContext } from "formik";

const SingleSession = ({ exercise, index, exercise_name }: any) => {
  const { values, setFieldValue } = useFormikContext<any>();

  const onDeleteSession = () => {
    exercise.splice(index, 1);

    setFieldValue("exercises", [...values.exercises]);
  };

  const onChangeInput = (inputName: string, e: any) => {
    exercise[index][inputName] = e.target.value;

    exercise[index]["session_num"] = index + 1;

    setFieldValue("exercises", [...values.exercises]);
  };

  return (
    <div className="my-6 py-2 border-t-[1px] border-b-[1px]">
      <div className="flex items-center justify-between">
        <Text>
          {"الجلسة رقم "} {index + 1}
        </Text>
        <Button onClick={() => onDeleteSession()}>
          <Img src="/images/trash.svg" />
        </Button>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <Text as="h5" className="mb-2">
            العدات
          </Text>
          <Input
            name="counter"
            isForm={false}
            value={exercise[index].counter}
            onChange={(e) => onChangeInput("counter", e)}
          />
        </div>
        <div className="border-[1px] rounded-full p-2">
          <Text as="h2">{exercise_name ?? exercise.exercise_id?.label}</Text>
        </div>
        <div>
          <Text as="h5" className="mb-2">
            وقت الراحة
          </Text>
          <Input
            name="rest_sec"
            isForm={false}
            value={exercise[index].rest_sec}
            onChange={(e) => onChangeInput("rest_sec", e)}
          />
        </div>
      </div>
    </div>
  );
};

interface Props {
  exercise: any;
}

export default function EditExerciseSessions({ exercise }: Props) {
  const { values, setFieldValue } = useFormikContext<any>();

  const onAddSession = () => {
    exercise?.sessions.push({ is_new: 1 });

    setFieldValue("exercises", [...values.exercises]);
  };

  return (
    <div>
      <Text as="h1">خصائص التمرين</Text>

      {exercise?.sessions?.map((_session: any, index: number) => (
        <SingleSession
          key={index}
          exercise={exercise?.sessions}
          index={index}
          exercise_name={exercise?.exercise_name ?? exercise.exercise_id?.label}
        />
      ))}
      <Button className="flex items-center gap-1" onClick={onAddSession}>
        <Img src="/images/plus.svg" />
        <Text>إضافة جلسة</Text>
      </Button>

      <div className="flex items-center justify-evenly mt-6">
        <Button
          className="w-[100px]"
          primary
          onClick={() => {
            setFieldValue("exercises", [...values.exercises]);
            document.getElementById("edit-exercise-sessions")?.click();
          }}
        >
          حفظ
        </Button>
        <Button
          className="w-[100px]"
          primary
          onClick={() =>
            document.getElementById("edit-exercise-sessions")?.click()
          }
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
}
