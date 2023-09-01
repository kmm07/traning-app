import { Card, Text } from "components";

// type Props = {};

function HeathInfo() {
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
      <div className="grid grid-cols-6 w-full">
        <Text>2</Text>
        <Text>10</Text>
        <Text>9</Text>
        <Text>20</Text>
        <Text>90</Text>
        <Text>انقاص الوزن</Text>
      </div>
    </Card>
  );
}

export default HeathInfo;
