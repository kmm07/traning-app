import { Card, Input, Select, Text } from "components";
import { useFormikContext } from "formik";

// type Props = {};

function HeathInfo() {
  const { values, setFieldValue } = useFormikContext<any>();

  const targetOptions = [
    { label: "زيادة الوزن", value: "increase" },
    { label: "إنقاص الوزن", value: "decrease" },
    { label: "الحفاظ علي الوزن", value: "keep" },
  ];

  return (
    <Card className="flex flex-col gap-[13px]  mb-[15px] mt-3 p-4 w-full">
      <Text size="3xl">المعلومات الصحية</Text>
      <div className="grid grid-cols-6 text-start w-full">
        <Text className="whitespace-normal">الوزن</Text>
        <Text className="whitespace-normal">الطول</Text>
        <Text className="whitespace-normal">العمر</Text>
        <Text className="whitespace-normal">مستوى النشاط</Text>
        <Text className="whitespace-normal">الوزن المستهدف</Text>
        <Text className="whitespace-normal">الهدف</Text>
      </div>
      <div className="bg-indigo-500 h-[3px]" />
      <div className="grid grid-cols-6 w-full gap-4">
        <Input name="weight" className="!text-[24px] font-bold !w-[80px]" />

        <Input name="height" className="!text-[24px] font-bold !w-[80px]" />

        <Input name="age" className="!text-[24px] font-bold !w-[80px]" />

        <Input
          name="weekly_activity"
          className="!text-[24px] font-bold !w-[80px]"
        />

        <Input
          name="target_weight"
          className="!text-[24px] font-bold !w-[80px]"
        />

        <Select
          options={targetOptions}
          name="target"
          value={values.target}
          isForm={false}
          onChange={(e) => setFieldValue("target", e)}
          className="w-[200px]"
        />
      </div>
    </Card>
  );
}

export default HeathInfo;
