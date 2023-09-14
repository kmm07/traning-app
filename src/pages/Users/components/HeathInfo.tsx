import { Card, Text } from "components";

// type Props = {};

function HeathInfo({ activeUser }: { activeUser: any }) {
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
        <Text>{activeUser?.weight}</Text>
        <Text>{activeUser?.height}</Text>
        <Text>{activeUser?.age}</Text>
        <Text>{activeUser?.weekly_activity}</Text>
        <Text>{activeUser?.target_weight}</Text>
        <Text>
          {activeUser?.target === "decrease" ? "إنقاص الوزن" : "زيادة الوزن"}
        </Text>
      </div>
    </Card>
  );
}

export default HeathInfo;
