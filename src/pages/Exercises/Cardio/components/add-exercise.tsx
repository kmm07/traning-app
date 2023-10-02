import { Button, Img, Input, Text } from "components";
import { useFormikContext } from "formik";
import { useState } from "react";

export default function AddCardio() {
  const [exercise, setExercise] = useState({ name: "", met: "", is_new: 1 });

  const { setFieldValue, values } = useFormikContext<any>();

  const onAddExercise = () => {
    setFieldValue("cardios", [...(values?.cardios as any), exercise]);

    setExercise({ name: "", met: "", is_new: 1 });

    document.getElementById("cardio-exercise")?.click();
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          name=""
          label="الإسم"
          value={exercise.name}
          onChange={(e) => setExercise({ ...exercise, name: e.target.value })}
          isForm={false}
        />
        <Input
          name=""
          label="مستوي الشدة"
          value={exercise.met}
          onChange={(e) => setExercise({ ...exercise, met: e.target.value })}
          isForm={false}
        />
      </div>
      <div className="flex items-center justify-center gap-6 mt-6">
        <Button
          primary
          className="flex items-center gap-1"
          onClick={onAddExercise}
        >
          <Img src="/images/plus.svg" />
          <Text className="!text-white">إضافة</Text>
        </Button>

        <Button
          danger
          onClick={() => document.getElementById("cardio-exercise")?.click()}
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
}
