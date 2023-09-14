import { Button, Input } from "components";
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";

interface stepsData {
  description: string;
}

export default function AddStep({
  editData,
  setEditData,
}: {
  editData: any;
  setEditData: any;
}) {
  const [stepsData, setStepsData] = useState<stepsData>({
    description: "",
  });

  const onClose = () => {
    document.getElementById("add-step")?.click();
    setEditData(null);
  };

  const { values, setFieldValue } = useFormikContext<{
    prepare: any;
  }>();

  const onSaveIngredient = () => {
    if (editData !== null) {
      const filteredArray = values.prepare?.steps?.filter(
        (step: stepsData) => step !== editData
      );

      setFieldValue("prepare", {
        ...values.prepare,
        steps: [...filteredArray, stepsData.description],
      });
    } else
      setFieldValue("prepare", {
        ...values.prepare,
        steps: [...(values.prepare?.steps as any), stepsData.description],
      });

    onClose();
  };

  useEffect(() => {
    if (editData === null) {
      setStepsData({
        description: "",
      });
    } else setStepsData({ description: editData });
  }, [editData]);

  return (
    <div>
      <div>
        <Input
          name="description"
          label={"الوصف"}
          onChange={(e) =>
            setStepsData({ ...stepsData, description: e.target.value })
          }
          value={stepsData?.description}
          isForm={false}
        />
      </div>
      <div className="flex items-center justify-evenly mt-6">
        <Button className="w-[100px]" primary onClick={onSaveIngredient}>
          إضافة
        </Button>
        <Button className="w-[100px]" primary onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
