import { Button, Card, RadialProgress, Select, Text } from "components";

function TrainingInfo() {
  return (
    <Card className="grid grid-cols-3 gap-10 p-4 mt-4">
      <div className="flex flex-col gap-4">
        <Text as="h2">المعلومات التدريبية:</Text>
        <Text as="h2">المستوي</Text>
        <Card className="p-3">
          <Select isForm={false} name="" options={[]} />
        </Card>

        <Text as="h2">كم يوم في الإسبوع</Text>
        <Card className="p-3">
          <Select isForm={false} name="" options={[]} />
        </Card>

        <Text as="h2">نوع الجدول التدريبي</Text>
        <Card className="p-3">
          <Select isForm={false} name="" options={[]} />
        </Card>
      </div>
      <div></div>
      <div>
        <Text as="h2">أيام الراحة</Text>
        <div className="flex items-center flex-wrap gap-4 mt-4 border-b-[3px] border-primary">
          <Button className="!w-[45%] !border-[1px]">السبت</Button>
          <Button className="!w-[45%]" secondaryBorder>
            الأحد
          </Button>
          <Button className="!w-[45%]" secondaryBorder>
            الإثنين
          </Button>
          <Button className="!w-[45%] !border-[1px]">الثلاثاء</Button>
          <Button className="!w-[45%] !border-[1px]">الأربعاء</Button>
          <Button className="!w-[45%]" secondaryBorder>
            الخميس
          </Button>
          <Button className="!w-[45%]">الجمعة</Button>
        </div>
        <div className="flex justify-center mt-4">
          <RadialProgress
            percentage={(5 / 9) * 100}
            label={"تقدم برنامج التدريب"}
            className="text-[#E80054]"
            body={
              <div className="flex flex-col gap-2 justify-center items-center">
                <Text>{}</Text>
                <Text>5/9</Text>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
}

export default TrainingInfo;
