import { Button, Input } from "components";
import { useFormikContext } from "formik";
import React, { useState } from "react";

interface Props {
  setCardioData: any;
  cardioData: any;
}

export default function AddCardio({}: Props) {
  const [exercise, setExercise] = useState({ name: "", met: "", is_new: 1 });

  const { setFieldValue, values } = useFormikContext<{ cardios: any }>();

  const onAddExercise = () => {
    setFieldValue("cardios", [...values?.cardios, exercise]);

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
      <Button onClick={onAddExercise}>إضافة التمرين</Button>
    </div>
  );
}