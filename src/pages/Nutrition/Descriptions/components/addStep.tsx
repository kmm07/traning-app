import { Button, TextArea } from "components";
import { useFormikContext } from "formik";
import { useState, useEffect } from "react";

interface stepsData {
  description: string;
}

export default function AddStep({
  editData,
  setEditData,
  isEmpty = false,
}: {
  editData: any;
  setEditData: any;
  isEmpty?: boolean;
}) {
  const [stepsData, setStepsData] = useState<stepsData>({
    description: "",
  });

  const onClose = () => {
    if (isEmpty) {
      document.getElementById("add-step-empty")?.click();
    } else {
      document.getElementById("add-step")?.click();
    }
    setEditData(null);

    setStepsData({ description: "" });
  };

  const { values, setFieldValue } = useFormikContext<{
    prepare: any;
  }>();

  const onSaveStep = () => {
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
        steps: [...(values.prepare?.steps ?? []), stepsData.description],
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
        <TextArea
          name="description"
          label={"الوصف"}
          onChange={(e) =>
            setStepsData({ ...stepsData, description: e.target.value })
          }
          value={stepsData?.description}
          isForm={false}
          className="border-[1px]"
        />
      </div>
      <div className="flex items-center justify-evenly mt-6">
        <Button className="w-[100px]" primary onClick={onSaveStep}>
          إضافة
        </Button>
        <Button className="w-[100px]" primary onClick={onClose}>
          إلغاء
        </Button>
      </div>
    </div>
  );
}
